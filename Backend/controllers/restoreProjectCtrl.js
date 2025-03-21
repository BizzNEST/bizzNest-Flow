import promisePool from "../config/database.js";

const restoreProjectCtrl = {
    restoreProject : async (req, res) => {
        try{
            const { projectID } = req.params;
            // console.log("Received ProjectID:", projectID); // Debugging log

            if(!projectID){
                return res.status(400).json({message: "Project ID is required"});
            }

            const connection = await promisePool.getConnection();
            await connection.beginTransaction();

            const checkProjectQuery = `SELECT * FROM bizznestflow2.projects WHERE projectID = ?;`;
            const [projectExists] = await connection.execute(checkProjectQuery, [projectID]);

            if(projectExists.length === 0){
                // console.log("Project not found in database.");
                await connection.rollback();
                connection.release();
                return res.status(404).json({message: "Project not found"});
            }

            const updateProjectQuery = `
                UPDATE bizznestflow2.projects
                SET status = 'In-Progress'
                WHERE projectID = ?;
            `;
            const [projectResult] = await connection.execute(updateProjectQuery, [projectID]);

            // console.log("Project Update Result:", projectResult);


            const updateInternsQuery = `
                UPDATE bizznestflow2.internProjects
                SET status = 'In-Progress'
                WHERE projectID = ?;
            `;
            const [internsResult] = await connection.execute(updateInternsQuery, [projectID]);

            // console.log("Intern Projects Update Result:", internsResult);

            await connection.commit();
            connection.release();

            res.status(200).json({message: "Project and associated interns marked as in progress"});
        }catch(error){
            console.error("Error restoring project:", error);
            res.status(500).json({message: "Error restoring project", error: error.message});
        }
    }
};

export default restoreProjectCtrl;