import promisePool from "../config/database.js";

const getCompletedProjectsCtrl = {
    getCompletedProjects: async (req, res) => {
        try {
            const query = `
                SELECT 
                    p.projectID, 
                    p.projectTitle, 
                    p.projectDescription, 
                    p.departmentID, 
                    d.departmentName

                FROM bizznestflow2.projects p
                LEFT JOIN bizznestflow2.departments d ON p.departmentID = d.departmentID 
                WHERE p.status = 'Completed';
            `;
            
            const [completedProjects] = await promisePool.execute(query);
            res.status(200).json(completedProjects);
        } catch (error) {
            console.error("Error fetching completed projects:", error.message);
            res.status(500).json({ message: "Error fetching completed projects" });
        }
    },

    getCompletedProject: async (req, res) => {
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
                    d.departmentName, 

                    -- Group tools separately
                    COALESCE(
                        (SELECT JSON_ARRAYAGG(
                            JSON_OBJECT('toolID', pt.toolID, 'difficulty', pt.difficulty)
                        ) 
                        FROM bizznestflow2.projectTools pt 
                        WHERE pt.projectID = p.projectID), '[]') AS tools

                FROM bizznestflow2.projects p
                LEFT JOIN bizznestflow2.departments d ON p.departmentID = d.departmentID
                WHERE p.projectID = ?;
            `;

            const [result] = await promisePool.execute(query, [projectID]);

            if (result.length === 0) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const project = result[0];
            project.tools = typeof project.tools === "string" ? JSON.parse(project.tools) : [];

            res.status(200).json(project);
        } catch (error) {
            console.error('Error getting project:', error.message);
            res.status(500).json({ message: 'Error getting project' });
        }
    }
}
export default getCompletedProjectsCtrl;