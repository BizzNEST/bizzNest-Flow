import React, { useEffect, useState } from 'react';
import './CompletedProjects.css';

// Department icons
import filmImg from "../assets/film-svgrepo-com.svg";
import designImg from "../assets/brush-svgrepo-com.svg";
import codingImg from "../assets/code-svgrepo-com.svg";
import resetImg from "../assets/restart-svgrepo-com.svg";

import NavBar from '../components/Navbar/NavBar';

/**
 * CompletedProjects Component
 * Displays a list of completed projects and allows reactivation of individual projects.
 */
const CompletedProjects = () => {
    const [projects, setProjects] = useState([]); // Stores completed projects
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Navbar mobile menu toggle

    /**
     * useEffect - Fetches completed projects on mount
     */
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/getCompletedProjects`);
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    console.error('Failed to fetch projects');
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    /**
     * handleReactivate - Restores a completed project via PUT request
     * @param {number} projectID - ID of the project to reactivate
     */
    const handleReactivate = async (projectID) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/restoreProject/${projectID}`, {
                method: 'PUT',
            });

            if (response.ok) {
                // Remove the reactivated project from the list
                const updatedProjects = projects.filter((project) => project.projectID !== projectID);
                setProjects(updatedProjects);
            } else {
                console.error('Failed to reactivate project');
            }
        } catch (error) {
            console.error('Error reactivating project:', error);
        }
    };

    // Icons based on department name
    const departmentIcons = {
        "Film": filmImg,
        "Design": designImg,
        "Web Development": codingImg,
    };

    // Background color gradients for each department
    const departmentBackgroundColors = {
        "Film": "linear-gradient(to right,#ec4899, #a655f1)",
        "Design": "linear-gradient(to right, #f59e0b, #f97316)",
        "Web Development": "linear-gradient(to right,#2dd4bf, #3b82f6)"
    };

    return (
        <div className="nav-container">
            {/* Navigation Bar */}
            <NavBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

            {/* Page Content */}
            <div className="completedProjectsWrapper">
                <h1>Completed Projects</h1>

                <div className="completedProjectContainer">
                    {projects.map((project) => (
                        <div className="compProjectDiv" key={project.projectID}>
                            {/* Project Header */}
                            <div className="completedProjectDescription">
                                <h2>{project.projectTitle}</h2>

                                {/* Department Tag with icon and color */}
                                <div
                                    className="department"
                                    style={{ background: departmentBackgroundColors[project.departmentName] }}
                                >
                                    {project.departmentName === "Web Development" ? "Web Dev" : project.departmentName || "No Departments"}

                                    {departmentIcons[project.departmentName] && (
                                        <img
                                            src={departmentIcons[project.departmentName]}
                                            alt={`${project.departmentName} icon`}
                                            className="departmentIcon"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Project Description */}
                            <p>{project.projectDescription}</p>

                            {/* Restore Button */}
                            <button className="Reactivate" onClick={() => handleReactivate(project.projectID)}>
                                <img src={resetImg} alt="reactivate" />
                                Restore Project
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompletedProjects;
