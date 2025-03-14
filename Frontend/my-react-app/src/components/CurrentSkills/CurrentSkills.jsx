import React, { useEffect, useState } from "react";
import "./CurrentSkills.css";

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

const CurrentSkills = ({ internID }) => {
    const [currentSkills, setCurrentSkills] = useState([]);

    useEffect(() => {
        const fetchCurrentSkills = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/internGrowth/${internID}`);
                const data = await response.json();

                if (data.success) {
                    setCurrentSkills(data.data.map(skill => ({
                        toolName: toolMap[skill.toolID] || `Tool ${skill.toolID}`,
                        currentSkillLevel: skill.currentSkillLevel.toFixed(2)
                    })));
                }
            } catch (error) {
                console.error("Error fetching current skills:", error);
            }
        };

        fetchCurrentSkills();
    }, [internID]);

    return (
        <div className="final-skills-container">
            <h2>Current Skills</h2>
            <ul>
                {currentSkills.map(skill => (
                    <li key={skill.toolName}>
                        {skill.toolName}: {skill.currentSkillLevel}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrentSkills;