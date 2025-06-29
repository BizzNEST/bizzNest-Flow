import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../pages/HomePage.module.css';

const Projects  = () => {
  const [projects, setProjects] = useState([]); // State for holding projects
  const navigate = useNavigate();
  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/getProjects`);
        if (response.ok) {
          const data = await response.json();
          const animation = data.map((project) => ({
            ...project,
            animationDelay: `${Math.random() * 2}s`, // random delay between 0 and 2 seconds
          }));
          setProjects(animation);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className={styles.projects}>
      {projects.map((projects) => (
        <div 
          key={projects.projectID}
          className={styles.projectCard}
          style={{ animationDelay: projects.animationDelay }}
          onClick={() => navigate(`/project/${projects.projectID}`)} // Route to ProjectInfoPage
        >
          <h3>{projects.projectTitle}</h3>
          </div>
      ))}
    </div>
  );
};

export default Projects