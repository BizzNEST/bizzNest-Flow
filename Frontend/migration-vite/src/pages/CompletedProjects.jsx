import React, { useEffect, useState } from 'react';
import './CompletedProjects.css';
import filmImg from "../assets/film-svgrepo-com.svg";
import designImg from "../assets/brush-svgrepo-com.svg";
import codingImg from "../assets/code-svgrepo-com.svg";
import resetImg from "../assets/restart-svgrepo-com.svg"
import NavBar from '../components/Navbar/NavBar';

const CompletedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ State for Navbar menu toggle

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

    const handleReactivate = async (projectID) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/restoreProject/${projectID}`, {
                method: 'PUT',
            });
            if (response.ok) {
                const updatedProjects = projects.filter((project) => project.projectID !== projectID);
                setProjects(updatedProjects);
            } else {
                console.error('Failed to reactivate project');
            }
        } catch (error) {
            console.error('Error reactivating project:', error);
        }
    };

    const departmentIcons = {
        "Film": filmImg,
        "Design": designImg,
        "Web Development": codingImg,
    };

    const departmentBackgroundColors = {
        "Film" : "linear-gradient(to right,#ec4899,  #a655f1)",
        "Design": "linear-gradient(to right, #f59e0b, #f97316)",
        "Web Development" : "linear-gradient(to right,#2dd4bf, #3b82f6)"
    };

    return (
        <div className="nav-container">
            {/* ✅ Navbar added at the top */}
            <NavBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

            <div className="completedProjectsWrapper">
                <h1>Completed Projects</h1>
                <div className="completedProjectContainer">
                    {projects.map((project) => (
                        <div className='compProjectDiv' key={project.projectID}>
                            <div className="completedProjectDescription">
                                <h2>{project.projectTitle}</h2>
                                <div className="department" style={{ background: departmentBackgroundColors[project.departmentName]}}>
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
                            <p>{project.projectDescription}</p>
                            <button className='Reactivate' onClick={() => handleReactivate(project.projectID)}>
                                <img src={resetImg} alt='reactivate' />
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