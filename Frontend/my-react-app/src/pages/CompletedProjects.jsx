import React, { useEffect, useState } from 'react';
import './CompletedProjects.css';

const CompletedProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:3360/getCompletedProjects');
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
            const response = await fetch(`http://localhost:3360/restoreProject/${projectID}`, {
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
    }
    return (
        <div className='completedProjectsWrapper'>
            <h1>Completed Projects</h1>
            <div className="completedProjectContainer">
                {projects.map((project) => (
                    <div className='compProjectDiv' key={project.projectID}>
                        <h2>{project.projectTitle}</h2>
                        <button className='Reactivate' onClick={() => handleReactivate(project.projectID)}>Reactivate</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default CompletedProjects;