import React, { useEffect, useState } from "react";
import "./InitialSkills.css";

// Mapping of numeric tool IDs to descriptive skill names
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

/**
 * InitialSkills Component
 * Fetches and displays an intern's initial skill levels.
 * 
 * @param {Object} props
 * @param {string} props.internID - ID of the intern whose skills will be shown
 */
const InitialSkills = ({ internID }) => {
    const [initialSkills, setInitialSkills] = useState([]);

    useEffect(() => {
        // Fetches initial skills from the backend for the provided intern ID
        const fetchInitialSkills = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/internGrowth/${internID}`);
                const data = await response.json();

                // If data is successfully fetched, map tool IDs to names and format skill levels
                if (data.success) {
                    setInitialSkills(data.data.map(skill => ({
                        toolName: toolMap[skill.toolID] || `Tool ${skill.toolID}`,
                        initialSkillLevel: skill.initialSkillLevel.toFixed(2)
                    })));
                }
            } catch (error) {
                // Log any fetch errors
                console.error("Error fetching initial skills:", error);
            }
        };

        // Call the fetch function when component mounts or internID changes
        fetchInitialSkills();
    }, [internID]);

    return (
        <div className="initial-skills-container">
            <h2>Initial Skills</h2>
            <ul>
                {/* Render the skill name and formatted level */}
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
