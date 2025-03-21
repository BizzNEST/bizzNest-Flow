import promisePool from "../config/database.js";

const completeProjectCtrl = {
    completeProject: async (req, res) => {
        try {
            const { projectID } = req.params;

            // console.log("Received ProjectID:", projectID); // Debugging log

            // Validate projectID
            if (!projectID) {
                return res.status(400).json({ message: "Project ID is required" });
            }

            // Start a transaction to ensure consistency
            const connection = await promisePool.getConnection();
            await connection.beginTransaction();

            // Check if project exists
            const checkProjectQuery = `SELECT * FROM bizznestflow2.projects WHERE projectID = ?;`;
            const [projectExists] = await connection.execute(checkProjectQuery, [projectID]);

            if (projectExists.length === 0) {
                // console.log("Project not found in database."); // Debug log
                await connection.rollback();
                connection.release();
                return res.status(404).json({ message: "Project not found" });
            }

            // Update the project status to 'Completed'
            const updateProjectQuery = `
                UPDATE bizznestflow2.projects 
                SET status = 'Completed' 
                WHERE projectID = ?;
            `;
            const [projectResult] = await connection.execute(updateProjectQuery, [projectID]);

            // console.log("Project Update Result:", projectResult); // Debugging log

            // Update the intern_projects table to mark all associated interns as 'Completed'
            const updateInternsQuery = `
                UPDATE bizznestflow2.internProjects 
                SET status = 'Completed' 
                WHERE projectID = ?;
            `;
            const [internsResult] = await connection.execute(updateInternsQuery, [projectID]);

            // console.log("Intern Projects Update Result:", internsResult); // Debugging log

            const checkMatchQuery = `
                SELECT s.skillID, s.InternID, s.toolID, s.skillLevel, pg.absoluteGrowth 
                FROM bizznestflow2.skills s
                JOIN bizznestflow2.projectedGrowth pg 
                    ON s.InternID = pg.InternID 
                    AND s.toolID = pg.toolID
                WHERE pg.projectID = ?;
            `;

            const [matchCheck] = await connection.execute(checkMatchQuery, [projectID]);

            const updateSkillsQuery = `
                UPDATE bizznestflow2.skills s
                JOIN bizznestflow2.projectedGrowth pg 
                    ON s.InternID = pg.InternID 
                    AND s.toolID = pg.toolID
                SET s.skillLevel = s.skillLevel + ABS(pg.absoluteGrowth)
                WHERE pg.projectID = ? 
                AND pg.absoluteGrowth IS NOT NULL 
                AND pg.absoluteGrowth > 0;
            `;

            await connection.execute(updateSkillsQuery, [projectID]);

            // Commit the transaction
            await connection.commit();
            connection.release();

            res.status(200).json({ message: "Project and associated interns marked as completed" });
        } catch (error) {
            // console.error("Error completing project:", error); // Logs full error details
            res.status(500).json({ message: "Error completing project", error: error.message });
        }
    },
};

export default completeProjectCtrl;