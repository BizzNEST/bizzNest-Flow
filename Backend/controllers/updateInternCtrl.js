import promisePool from '../config/database.js';

const updateInternCtrl = {
    updateIntern: async (req, res) => {
        try {
            const internID = Number(req.params.internID);
            const {
                firstName,
                lastName,
                location,
                departmentID,
                webDevSkills = {},
                designSkills = {},
                filmSkills = {}
            } = req.body;

            // console.log('📥 Received InternID:', internID);
            // console.log('📥 Received Data:', req.body);

            // Validate required fields
            if (!internID || !firstName || !lastName || !location || departmentID === undefined) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            // Update intern information
            const updateInternQuery = `
                UPDATE bizznestflow2.interns 
                SET firstName = ?, lastName = ?, location = ?, departmentID = ?
                WHERE InternID = ?;
            `;
            await promisePool.execute(updateInternQuery, [firstName, lastName, location, departmentID, internID]);

            // Update or insert skills dynamically
            const skills = [
                ...Object.entries(webDevSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
                ...Object.entries(designSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
                ...Object.entries(filmSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
            ];

            for (const skill of skills) {
                const { toolID, skillLevel } = skill;
                if (toolID === undefined || skillLevel === undefined) continue;

                // Check if the skill exists
                const [existingSkill] = await promisePool.execute(
                    `SELECT COUNT(*) as count FROM bizznestflow2.skills WHERE InternID = ? AND toolID = ?`,
                    [internID, toolID]
                );

                if (existingSkill[0].count > 0) {
                    // console.log(`🔄 Updating skill: InternID=${internID}, toolID=${toolID}, skillLevel=${skillLevel}`);
                    await promisePool.execute(
                        `UPDATE bizznestflow2.skills SET skillLevel = ? WHERE InternID = ? AND toolID = ?`,
                        [skillLevel, internID, toolID]
                    );
                } else {
                    // console.log(`⚡ Inserting new skill: InternID=${internID}, toolID=${toolID}, skillLevel=${skillLevel}`);
                    await promisePool.execute(
                        `INSERT INTO bizznestflow2.skills (InternID, toolID, skillLevel) VALUES (?, ?, ?)`,
                        [internID, toolID, skillLevel]
                    );
                }
                const [existingInitialSkill] = await promisePool.execute(
                    `SELECT COUNT(*) as count FROM bizznestflow2.initialSkills WHERE InternID = ? AND toolID = ?`,
                    [internID, toolID]
                );
            
                if (existingInitialSkill[0].count === 0) {
                    // console.log(`⚡ Inserting into initialSkills: InternID=${internID}, toolID=${toolID}, initialSkillLevel=${skillLevel}`);
                    await promisePool.execute(
                        `INSERT INTO bizznestflow2.initialSkills (InternID, toolID, initialSkillLevel) VALUES (?, ?, ?)`,
                        [internID, toolID, skillLevel]
                    );
                }
            }

            res.status(200).json({ message: 'Intern updated successfully!' });
        } catch (error) {
            console.error('❌ Error updating intern:', error.message);
            res.status(500).json({ message: 'Error updating intern.' });
        }
    },
};

export default updateInternCtrl;