import React, { useEffect, useState } from "react";
import "./FinalSkills.css";

const toolMap = {
    0: "Frontend",
    1: "Backend",
    2: "WordPress",
    3: "Photoshop",
    4: "Illustrator",
    5: "Figma",
    6: "Premiere Pro",
    7: "Camera Work"
};

const FinalSkills = ({ internID }) => {
    const [finalSkills, setFinalSkills] = useState([]);

    useEffect(() => {
        const fetchFinalSkills = async () => {
            try {
                const response = await fetch(`http://localhost:3360/internGrowth/${internID}`);
                const data = await response.json();

                if (data.success) {
                    setFinalSkills(data.data.map(skill => ({
                        toolName: toolMap[skill.toolID] || `Tool ${skill.toolID}`,
                        currentSkillLevel: skill.currentSkillLevel.toFixed(2)
                    })));
                }
            } catch (error) {
                console.error("Error fetching final skills:", error);
            }
        };

        fetchFinalSkills();
    }, [internID]);

    return (
        <div className="final-skills-container">
            <h2>Final Skills</h2>
            <ul>
                {finalSkills.map(skill => (
                    <li key={skill.toolName}>
                        {skill.toolName}: <strong>{skill.currentSkillLevel}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FinalSkills;