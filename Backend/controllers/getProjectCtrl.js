import promisePool from '../config/database.js';

const getProjectCtrl = {
  /**
   * Fetch all projects
   */
  getProjects: async (req, res) => {
    try {
      const query = `
        SELECT 
          p.projectID, 
          p.projectTitle, 
          p.projectDescription, 
          p.departmentID,
          p.status,  -- Include project status

          -- Group tools separately
          COALESCE(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT('toolID', pt.toolID, 'difficulty', pt.difficulty)
            ) 
            FROM bizznestflow2.projectTools pt 
            WHERE pt.projectID = p.projectID), '[]'
          ) AS tools

        FROM bizznestflow2.projects p
        WHERE p.status != 'Completed';  -- 🔥 Exclude completed projects
      `;

      const [result] = await promisePool.execute(query);

      res.status(200).json(result.map(project => ({
        projectID: project.projectID,
        projectTitle: project.projectTitle,
        projectDescription: project.projectDescription,
        departmentID: project.departmentID,
        status: project.status,
        tools: typeof project.tools === "string" ? JSON.parse(project.tools) : [] // Ensure proper parsing
      })));

    } catch (error) {
      console.error('Error getting projects:', error.message);
      res.status(500).json({ message: 'Error getting projects' });
    }
  },

  /**
   * Fetch a specific project by ID
   */
  getProject: async (req, res) => {
    try {
      const { projectID } = req.params;

      if (!projectID) {
        return res.status(400).json({ message: 'ProjectID is required' });
      }

      const query = `
        SELECT 
          p.projectID, 
          p.projectTitle, 
          p.projectDescription, 
          p.departmentID, 

          -- Group tools separately
          COALESCE(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT('toolID', pt.toolID, 'difficulty', pt.difficulty)
            ) 
            FROM bizznestflow2.projectTools pt 
            WHERE pt.projectID = p.projectID), '[]') AS tools,

          -- Group assigned interns separately
          COALESCE(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT('InternID', i.InternID, 'firstName', i.firstName, 'lastName', i.lastName, 'role', ip.role)
            ) 
            FROM bizznestflow2.internProjects ip 
            LEFT JOIN bizznestflow2.interns i ON ip.InternID = i.InternID
            WHERE ip.ProjectID = p.projectID), '[]') AS assignedInterns

        FROM bizznestflow2.projects p

        WHERE p.projectID = ?;
      `;

      // console.log("Executing SQL Query:", query, "with projectID:", projectID);

      const [result] = await promisePool.execute(query, [projectID]);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Convert JSON strings into usable JavaScript objects
      const project = {
        projectID: result[0].projectID,
        projectTitle: result[0].projectTitle,
        projectDescription: result[0].projectDescription,
        departmentID: result[0].departmentID,
        status: result[0].status,
        tools: typeof result[0].tools === "string" ? JSON.parse(result[0].tools) : [],
        assignedInterns: typeof result[0].assignedInterns === "string" ? JSON.parse(result[0].assignedInterns) : []
      };

      res.status(200).json(project);
    } catch (error) {
      // console.log('Error getting project:', error.message);
      res.status(500).json({ message: 'Error getting project' });
    }
  }
};

export default getProjectCtrl;
