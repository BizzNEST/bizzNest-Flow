/* controllers/recommendationsCtrl.js */
import promisePool from '../config/database.js'; // Adjust path as needed

const recommendationsCtrl = {
  getRecommendations: async (req, res) => {
    const { projectID, departmentID } = req.query;
    const numericProjectID = Number(projectID);
    const numericDepartmentID = Number(departmentID);

    // Validate inputs first
    if (isNaN(numericProjectID) || isNaN(numericDepartmentID)) {
        return res.status(400).json({ message: 'Invalid or missing projectID or departmentID. Must be numbers.' });
    }

    // Initialize the response structure with guaranteed keys and default array values
    let responsePayload = {
        projects: [],
        internSkills: [],
        skillDifferences: [],
        assignedInterns: []
    };

    try {
      // Check if the project itself exists
      const [projectCheck] = await promisePool.execute(
          `SELECT projectID, projectTitle, departmentID FROM bizznestflow2.projects WHERE projectID = ? AND departmentID = ?`,
          [numericProjectID, numericDepartmentID]
      );

      if (projectCheck.length === 0) {
          // Project doesn't exist or doesn't belong to the department
          return res.status(404).json({ message: 'Project not found or does not belong to the specified department.' });
      }

      // Populate basic project info into the payload
      responsePayload.projects.push({
          projectID: projectCheck[0].projectID,
          projectTitle: projectCheck[0].projectTitle,
          departmentID: projectCheck[0].departmentID,
          tools: [] // Initialize tools array
      });

      // Now run the main complex query
      const query = `
        SELECT
          p.projectID, /* Only needed for joins, already have main info */
          pt.toolID AS projectToolID, pt.difficulty,
          i.InternID, i.firstName, i.lastName, i.departmentID AS internDepartmentID,
          s.toolID AS skillToolID, s.skillLevel
        FROM bizznestflow2.projects p
        LEFT JOIN bizznestflow2.projectTools pt ON p.projectID = pt.projectID
        LEFT JOIN bizznestflow2.interns i ON i.departmentID = p.departmentID
        LEFT JOIN bizznestflow2.skills s ON i.InternID IS NOT NULL AND s.InternID = i.InternID AND s.toolID = pt.toolID
        WHERE p.projectID = ? AND p.departmentID = ?
        ORDER BY i.InternID, pt.toolID;
      `;
      const [results] = await promisePool.execute(query, [numericProjectID, numericDepartmentID]);

      // --- Process results ONLY if the main query found data ---
      if (results.length > 0) {
          // 1. Populate Project Tools
          results.forEach(row => {
              if (row.projectToolID !== null && !responsePayload.projects[0].tools.some(t => t.toolID === row.projectToolID)) {
                  responsePayload.projects[0].tools.push({
                      toolID: row.projectToolID,
                      difficulty: typeof row.difficulty === 'number' ? parseFloat(row.difficulty.toFixed(1)) : 0,
                  });
              }
          });

          // 2. Extract Intern Info and Relevant Skills
          const internSkillMap = new Map();
          results.forEach(row => {
              if (row.InternID === null) return;
              if (!internSkillMap.has(row.InternID)) {
                  internSkillMap.set(row.InternID, {
                      InternID: row.InternID, firstName: row.firstName, lastName: row.lastName,
                      departmentID: row.internDepartmentID, tools: [],
                  });
              }
              const intern = internSkillMap.get(row.InternID);
              if (row.skillToolID !== null && !intern.tools.some(t => t.toolID === row.skillToolID)) {
                  intern.tools.push({
                      toolID: row.skillToolID,
                      skillLevel: typeof row.skillLevel === 'number' ? parseFloat(row.skillLevel.toFixed(2)) : 0,
                  });
              }
          });
          responsePayload.internSkills = Array.from(internSkillMap.values());

          // 3. Calculate Skill Differences (Recommendations)
          const projectTools = responsePayload.projects[0]?.tools || [];
          responsePayload.skillDifferences = responsePayload.internSkills.map(intern => {
              const differences = intern.tools.map(internTool => {
                  const matchingProjectTool = projectTools.find(t => t.toolID === internTool.toolID);
                  if (!matchingProjectTool) return null;
                  const difficulty = matchingProjectTool.difficulty;
                  const skillLevel = internTool.skillLevel;
                  if (typeof difficulty !== 'number' || typeof skillLevel !== 'number') return null;

                  const difference = parseFloat((difficulty - skillLevel).toFixed(2));
                  const epsilon = 0.1;
                  const coeff = 10 / (skillLevel + Math.exp(-skillLevel) + epsilon);
                  const growthFactor = Math.exp(-(difference ** 2));
                  const absoluteIncrease = parseFloat((difference * growthFactor * coeff).toFixed(4));
                  const percentIncrease = (skillLevel > 0) ? parseFloat(((absoluteIncrease / skillLevel) * 100).toFixed(1)) : (absoluteIncrease > 0 ? Infinity : 0);
                  const eligibleForLeadership = difference <= 0;

                  return { toolID: internTool.toolID, difficulty, skillLevel, difference, absoluteIncrease, percentIncrease, eligibleForLeadership };
              }).filter(Boolean);
              return { InternID: intern.InternID, firstName: intern.firstName, lastName: intern.lastName, calculations: differences };
          }).filter(intern => intern.calculations.length > 0);

      } else {
            console.log(`Project ${numericProjectID} has no detailed intern/skill/tool matches from main query.`);
            // No changes needed to payload, already initialized with empty arrays.
      }


      // 4. Fetch Currently Assigned Interns (Always fetch, wrap in try/catch for specific errors)
      try {
          const [assignedInternsResults] = await promisePool.execute(
            `SELECT InternID, role FROM bizznestflow2.internProjects WHERE projectID = ?`,
            [numericProjectID]
          );
          // Ensure assignedInterns is always an array in the payload
          responsePayload.assignedInterns = Array.isArray(assignedInternsResults) ? assignedInternsResults : [];
          // console.log(`Assigned interns query succeeded, count: ${responsePayload.assignedInterns.length}`);
      } catch (assignError) {
          console.error(`ERROR fetching assigned interns specifically for project ${numericProjectID}:`, assignError);
          // Keep assignedInterns as an empty array in the payload on error, but log it.
          responsePayload.assignedInterns = [];
          // Consider if this specific error should prevent a 200 OK response.
          // For now, we proceed but log the error. The frontend expects the key to exist.
      }


      // --- Final Check and Send Response ---
      // Ensure required keys exist and are arrays just before sending (Defensive Check)
      responsePayload.skillDifferences = Array.isArray(responsePayload.skillDifferences) ? responsePayload.skillDifferences : [];
      responsePayload.assignedInterns = Array.isArray(responsePayload.assignedInterns) ? responsePayload.assignedInterns : [];

      // Logging right before sending response
      console.log(`DEBUG: Final check before send for project ${numericProjectID}:`);
      console.log(`DEBUG: - projects type: ${typeof responsePayload.projects}, isArray: ${Array.isArray(responsePayload.projects)}, length: ${responsePayload.projects?.length}`);
      console.log(`DEBUG: - internSkills type: ${typeof responsePayload.internSkills}, isArray: ${Array.isArray(responsePayload.internSkills)}, length: ${responsePayload.internSkills?.length}`);
      console.log(`DEBUG: - skillDifferences type: ${typeof responsePayload.skillDifferences}, isArray: ${Array.isArray(responsePayload.skillDifferences)}, length: ${responsePayload.skillDifferences?.length}`);
      console.log(`DEBUG: - assignedInterns type: ${typeof responsePayload.assignedInterns}, isArray: ${Array.isArray(responsePayload.assignedInterns)}, length: ${responsePayload.assignedInterns?.length}`);
      console.log(`DEBUG: - Sending payload with keys: ${Object.keys(responsePayload)}`);

      res.status(200).json(responsePayload);
      // ------------ End of try block ------------

    } catch (error) {
      // Catch errors from project check, main query, or other processing (but not assignedInterns fetch if handled above)
      console.error(`General error fetching recommendations for project ${numericProjectID}:`, error);
      res.status(500).json({ message: 'Server error fetching recommendations data.' });
    }
  }
};

export default recommendationsCtrl;