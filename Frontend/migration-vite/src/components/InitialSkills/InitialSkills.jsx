import React, { useEffect, useState } from "react";
import "./InitialSkills.css";

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

const InitialSkills = ({ internID }) => {
    const [initialSkills, setInitialSkills] = useState([]);

    useEffect(() => {
        const fetchInitialSkills = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/internGrowth/${internID}`);
                const data = await response.json();

                if (data.success) {
                    setInitialSkills(data.data.map(skill => ({
                        toolName: toolMap[skill.toolID] || `Tool ${skill.toolID}`,
                        initialSkillLevel: skill.initialSkillLevel.toFixed(2)
                    })));
                }
            } catch (error) {
                console.error("Error fetching initial skills:", error);
            }
        };

        fetchInitialSkills();
    }, [internID]);

    return (
        <div className="initial-skills-container">
            <h2>Initial Skills</h2>
            <ul>
                {initialSkills.map(skill => (
                    <li key={skill.toolName}>
                        {skill.toolName}: {skill.initialSkillLevel}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InitialSkills;