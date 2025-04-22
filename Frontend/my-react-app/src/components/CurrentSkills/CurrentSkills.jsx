import React, { useEffect, useState } from "react";
import "./CurrentSkills.css";

// Mapping of tool IDs to human-readable tool names
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

// React component to display current skill levels of an intern
const CurrentSkills = ({ internID }) => {
    const [currentSkills, setCurrentSkills] = useState([]);

    useEffect(() => {
        // Fetch current skills from the backend for the given intern
        const fetchCurrentSkills = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/internGrowth/${internID}`);
                const data = await response.json();

                if (data.success) {
                    // Map each skill to its name and format the skill level to 2 decimal places
                    setCurrentSkills(data.data.map(skill => ({
                        toolName: toolMap[skill.toolID] || `Tool ${skill.toolID}`,
                        currentSkillLevel: skill.currentSkillLevel.toFixed(2)
                    })));
                }
            } catch (error) {
                // Log any errors during fetch
                console.error("Error fetching current skills:", error);
            }
        };

        // Trigger the fetch on component mount and when internID changes
        fetchCurrentSkills();
    }, [internID]);

    return (
        <div className="final-skills-container">
            <h2>Current Skills</h2>
            <ul>
                {/* Render each skill with its corresponding tool name and skill level */}
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
