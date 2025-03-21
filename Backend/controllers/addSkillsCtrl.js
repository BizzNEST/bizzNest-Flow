import promisePool from '../config/database.js';

const addSkillsCtrl = {
    addSkills: async (req, res) => {
        try {
            const internID = Number(req.params.internID); // Convert internID to a number
            const { webDevSkills = {}, designSkills = {}, filmSkills = {} } = req.body;

            // console.log('📥 Received InternID:', internID);
            // console.log('📥 Received Skills Data:', req.body);

            // Validate required fields
            if (!internID) {
                return res.status(400).json({ message: 'InternID is required.' });
            }

            // Ensure intern exists before proceeding
            const [internExists] = await promisePool.execute(
                `SELECT InternID FROM bizznestflow2.interns WHERE InternID = ?`,
                [internID]
            );

            if (internExists.length === 0) {
                return res.status(400).json({ message: 'Intern not found.' });
            }

            // Prepare skills array
            const skills = [
                ...Object.entries(webDevSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
                ...Object.entries(designSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
                ...Object.entries(filmSkills).map(([toolID, skillLevel]) => ({ toolID: Number(toolID), skillLevel })),
            ];

            for (const skill of skills) {
                const { toolID, skillLevel } = skill;
                if (toolID === undefined || skillLevel === undefined) continue;

                // Check if skill already exists
                const [existingSkill] = await promisePool.execute(
                    `SELECT COUNT(*) as count FROM bizznestflow2.skills WHERE InternID = ? AND toolID = ?`,
                    [internID, toolID]
                );

                if (existingSkill[0].count === 0) {
                    // console.log(`⚡ Inserting skill: InternID=${internID}, toolID=${toolID}, skillLevel=${skillLevel}`);
                    await promisePool.execute(
                        `INSERT INTO bizznestflow2.skills (InternID, toolID, skillLevel) VALUES (?, ?, ?)`,
                        [internID, toolID, skillLevel]
                    );
                } else {
                    // console.log(`⚡ Skill already exists: InternID=${internID}, toolID=${toolID}. Skipping insert.`);
                }

                // Check if skill exists in initialSkills
                const [existingInitialSkill] = await promisePool.execute(
                    `SELECT COUNT(*) as count FROM bizznestflow2.initialSkills WHERE InternID = ? AND toolID = ?`,
                    [internID, toolID]
                );
                // console.log(`🔍 Checking initialSkills: InternID=${internID}, toolID=${toolID}, Count=${existingInitialSkill[0].count}`);

                if (existingInitialSkill[0].count === 0) {
                    // console.log(`⚡ Inserting into initialSkills: InternID=${internID}, toolID=${toolID}, initialSkillLevel=${skillLevel}`);
                    await promisePool.execute(
                        `INSERT INTO bizznestflow2.initialSkills (InternID, toolID, initialSkillLevel) VALUES (?, ?, ?)`,
                        [internID, toolID, skillLevel]
                    );
                } else {
                    // console.log(`✅ Skill already exists in initialSkills, skipping insert.`);
                }
            }

            res.status(201).json({ message: "Skills added successfully" });
        } catch (error) {
            console.error('❌ Error adding skills:', error.message);
            res.status(500).json({ message: 'Error adding skills' });
        }
    },
};

export default addSkillsCtrl;