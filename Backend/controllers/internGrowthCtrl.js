import promisePool from '../config/database.js';

const internGrowthCtrl = {
    getInternGrowth: async (req, res) => {
        try {
            const { internID } = req.params; // Get the internID from the route parameter

            if (!internID) {
                return res.status(400).json({ success: false, message: "Intern ID is required" });
            }

            // Query to get initial skills for the intern
            const initialSkillsQuery = `
                SELECT toolID, initialSkillLevel 
                FROM initialSkills
                WHERE InternID = ?
            `;
            const [initialSkills] = await promisePool.execute(initialSkillsQuery, [internID]);
            // console.log("Initial Skills Data:", initialSkills); // Log to see if data is returned

            // Query to get current skills for the intern
            const currentSkillsQuery = `
                SELECT toolID, skillLevel 
                FROM skills
                WHERE InternID = ?
            `;
            const [currentSkills] = await promisePool.execute(currentSkillsQuery, [internID]);
            // console.log("Current Skills Data:", currentSkills); // Log to see if data is returned

            // Check if initial or current skills are empty
            if (initialSkills.length === 0 || currentSkills.length === 0) {
                console.warn("No skills data found for intern ID:", internID);
                return res.status(404).json({ success: false, message: "No skill data found for this intern" });
            }

            // Map initial skills for quick lookup
            const initialSkillsMap = {};
            initialSkills.forEach(skill => {
                initialSkillsMap[skill.toolID] = skill.initialSkillLevel;
            });

            // Compute growth percentage for each tool
            const growthData = currentSkills.map(skill => {
                const initialLevel = initialSkillsMap[skill.toolID] || 0; 
                const currentLevel = skill.skillLevel;

                let growthPercentage = 0;
                if (initialLevel > 0) {
                    growthPercentage = ((currentLevel - initialLevel) / initialLevel) * 100;
                }

                return {
                    InternID: internID,
                    toolID: skill.toolID,
                    initialSkillLevel: initialLevel,
                    currentSkillLevel: currentLevel,
                    growthPercentage: growthPercentage.toFixed(2)
                };
            });

            // console.log("Final Growth Data:", growthData); // Log final data to check before sending to frontend

            res.json({ success: true, data: growthData });
        } catch (error) {
            console.error("Error fetching intern growth:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};

export default internGrowthCtrl;