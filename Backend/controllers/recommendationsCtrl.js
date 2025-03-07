import promisePool from '../config/database.js';


const recommendationsCtrl = {
  getRecommendations: async (req, res) => {
    try {
      // Extract projectID and departmentID from query parameters
      const { projectID, departmentID } = req.query;

      // Log the received query parameters
      console.log('Query Parameters:', { projectID, departmentID });

      if (!projectID || !departmentID) {
        return res.status(400).json({ message: 'Missing projectID or departmentID' });
      }

      // Query for the specific project and its tools
      const query = `
        SELECT 
          p.projectID,
          p.projectTitle,
          p.departmentID,
          pt.toolID AS projectToolID,
          pt.difficulty,
          i.InternID,
          i.firstName,
          i.lastName,
          s.toolID AS skillToolID,
          s.skillLevel
        FROM 
          bizznestflow2.projects p
        LEFT JOIN 
          bizznestflow2.projectTools pt ON p.projectID = pt.projectID
        LEFT JOIN 
          bizznestflow2.interns i ON i.departmentID = p.departmentID
        LEFT JOIN 
          bizznestflow2.skills s ON s.toolID = pt.toolID AND s.InternID = i.InternID
        WHERE 
          p.projectID = ? AND p.departmentID = ?;
      `;

      const [result] = await promisePool.execute(query, [projectID, departmentID]);

      // Aggregate data 
      const projects = result.reduce((acc, row) => {
        const project = acc.find(p => p.projectID === row.projectID);

        if (!project) {
          acc.push({
            projectID: row.projectID,
            projectTitle: row.projectTitle,
            departmentID: row.departmentID,
            tools: [],
          });
        }

        const currentProject = acc.find(p => p.projectID === row.projectID);

        if (
          row.projectToolID !== null &&
          row.projectToolID !== undefined &&
          !currentProject.tools.some(t => t.toolID === row.projectToolID)
        ) {
          currentProject.tools.push({
            toolID: row.projectToolID,
            difficulty: row.difficulty,
          });
        }

        return acc;
      }, []);

      const internSkills = result.reduce((acc, row) => {
        // Check if intern already exists in accumulator
        let intern = acc.find(i => i.InternID === row.InternID);
      
        // If intern doesn't exist, create a new entry
        if (!intern && row.InternID !== null && row.InternID !== undefined) {
          intern = {
            InternID: row.InternID,
            firstName: row.firstName,
            lastName: row.lastName,
            departmentID: row.departmentID,
            tools: [], // Start with an empty tools array
          };
          acc.push(intern);
        }
        // Add the tool to the current intern if it exists
        if (
          intern &&
          row.skillToolID !== null &&
          row.skillToolID !== undefined &&
          !intern.tools.some(t => t.toolID === row.skillToolID)
        ) {
          intern.tools.push({
            toolID: row.skillToolID,
            skillLevel: parseFloat(row.skillLevel.toFixed(2)), // Parse and round skillLevel
          });
        }
      
        return acc;
      }, []);
      console.log('Aggregated Intern Skills:', JSON.stringify(internSkills, null, 2));

      // Calculations HERE: START

      // Map interns to project tool difficulty
      const skillDifferences = internSkills.map(intern => {
        const differences = intern.tools.map(internTool => {
          const matchingProjectTool = projects[0]?.tools.find(
            projectTool => projectTool.toolID === internTool.toolID
          );
          if (matchingProjectTool) {
            const d = matchingProjectTool.difficulty; // Project tool difficulty
            const s = internTool.skillLevel; //intern skill level
            const x = parseFloat((d - s).toFixed(2)); // difference (d - s)

            const dynamicCoefficient = 10 / (s + Math.exp(-s));

            // Calculate f(x) = xe^(-x^2)
            const absoluteIncrease = parseFloat((x * Math.exp(-Math.pow(x, 2))).toFixed(4)) * dynamicCoefficient;

            // Calculate (abs increase / skillLevel)
            const percentIncrease = parseFloat(((absoluteIncrease / s) * 100).toFixed(1))

            // Leadership eligibility check
            const eligibleForLeadership = x <= 0; // only consider those than with x ≤ 0 as potential leaders

            return {
              toolID: internTool.toolID,
              difficulty: d,
              skillLevel: s,
              difference: x,
              absoluteIncrease,
              percentIncrease,
              eligibleForLeadership
            };
          }
          return null;
        });

        return {
          InternID: intern.InternID,
          firstName: intern.firstName,
          lastName: intern.lastName,
          calculations: differences.filter(diff => diff !== null),
        };
      });

      // Calculations HERE: END

      res.status(200).json({ projects, internSkills, skillDifferences });
    } catch (error) {
      console.error('Error fetching recommendations:', error.message);
      res.status(500).json({ message: 'Error fetching recommendations' });
    }
  },
};

export default recommendationsCtrl;