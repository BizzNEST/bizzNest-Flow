import React, { useEffect, useState } from 'react';
import './CompletedProjects.css';
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
                                <p>{project.departmentName || "No Departments"}</p>
                            </div>
                                <p>{project.projectDescription}</p>
                            <button className='Reactivate' onClick={() => handleReactivate(project.projectID)}>
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