import promisePool from "../config/database.js";

const updateInternsProjectsCtrl = {
    editInternsProject: async (req, res) => {
        try {
            const { projectID, internsToAdd = [], internsToRemove = [] } = req.body;

            if (!projectID) {
                return res.status(400).json({ message: "Project ID is required." });
            }

            // ✅ Remove interns from the project
            for (const internID of internsToRemove) {
                await promisePool.execute(
                    `DELETE FROM bizznestflow2.internProjects WHERE internID = ? AND projectID = ?`,
                    [internID, projectID]
                );
            }

            // ✅ Add interns to the project
            for (const intern of internsToAdd) {
                const internID = typeof intern === 'object' ? intern.internID : intern;
                const role = typeof intern === 'object' ? intern.role || null : null;

                const [existing] = await promisePool.execute(
                    `SELECT COUNT(*) as count FROM bizznestflow2.internProjects WHERE internID = ? AND projectID = ?`,
                    [internID, projectID]
                );

                if (existing[0].count === 0) {
                    await promisePool.execute(
                        `INSERT INTO bizznestflow2.internProjects (internID, projectID, role) VALUES (?, ?, ?)`,
                        [internID, projectID, role]
                    );
                }
            }

            res.status(200).json({ message: "Intern-project assignments updated successfully." });
        } catch (error) {
            console.error("❌ Error editing interns in project:", error.message);
            res.status(500).json({ message: "Server error while editing intern-project assignments." });
        }
    },
};

export default updateInternsProjectsCtrl;