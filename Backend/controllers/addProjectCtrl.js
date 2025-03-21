import promisePool from '../config/database.js';

const addProjectCtrl = {
    // Adds a new project and its tools with difficulty rankings
    addProject: async (req, res) => {
      try {
        // Retrieve project and tools data from the request body
        const { projectTitle, projectDescription, departmentID, tools } = req.body;
  
        // Validate project data
        if (!projectTitle || !projectDescription || departmentID === null || departmentID === undefined || !Array.isArray(tools)) {
          return res.status(400).json({ message: 'Missing required fields or invalid tools format' });
        }
  
        // Step 1: Insert the project into the projects table
        const projectQuery = `
          INSERT INTO bizznestflow2.projects (projectTitle, projectDescription, departmentID)
          VALUES (?, ?, ?);
        `;
        const [projectResult] = await promisePool.execute(projectQuery, [
          projectTitle,
          projectDescription,
          departmentID,
        ]);
  
        const projectID = projectResult.insertId; // Get the ID of the newly inserted project
  
        // Step 2: Insert tools with difficulty into the projectTools table
        const projectToolQuery = `
          INSERT INTO projectTools (projectID, toolID, difficulty)
          VALUES (?, ?, ?);
        `;
  
        for (const tool of tools) {
          const { toolID, difficulty } = tool;
  
          // Validate that toolID and difficulty are provided
          if (toolID === null || toolID === undefined || difficulty === null || difficulty === undefined) {
            return res.status(400).json({ message: 'Each tool must have a valid toolID and difficulty' });
          }
  
          // Insert into projectTools table
          await promisePool.execute(projectToolQuery, [projectID, toolID, difficulty]);
        }
  
        // console.log('Returning Response:', { projectID, departmentID });
        // Success response
        res.status(201).json({
          message: 'Project and tools added successfully!',
          projectID,
          departmentID, 
        });
      } catch (error) {
        console.error('Error adding project with tools:', error.message);
        res.status(500).json({ message: 'Error adding project and tools to the database' });
      }
    },
  };

export default addProjectCtrl;