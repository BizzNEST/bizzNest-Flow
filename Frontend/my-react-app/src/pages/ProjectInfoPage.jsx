import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectInfoPage.css';
import NavBar from '../components/Navbar/NavBar';

const ProjectInfoPage = () => {
  const { projectID } = useParams(); // Get projectID from URL params
  const [project, setProject] = useState(null); // Holds project data
  const navigate = useNavigate();

  // Fetch project info on page load
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getProject/${projectID}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error('Failed to fetch project data');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProject();
  }, [projectID]);

  // DELETE project
  const deleteProject = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteProject/${projectID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        navigate('/home'); // Go back to dashboard
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  // MARK project as complete
  const completeProject = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/completeProject/${projectID}`, {
        method: 'PUT',
      });
      if (response.ok) {
        navigate('/home');
      } else {
        alert('Failed to mark project as complete');
      }
    } catch (error) {
      console.error('Error marking project as complete:', error);
      alert('Error marking project as complete');
    }
  };

  // Calculate average difficulty from tools
  const calculateAverageDifficulty = () => {
    if (!project || !project.tools || project.tools.length === 0) return null;
    const total = project.tools.reduce((sum, tool) => sum + (tool.difficulty || 0), 0);
    return (total / project.tools.length).toFixed(1);
  };

  // Show loading state
  if (!project) return <p>Loading project details...</p>;

  // Mapping toolID to readable names
  const toolNames = {
    0: "Frontend",
    1: "Backend",
    2: "Wordpress",
    3: "Photoshop",
    4: "Illustrator",
    5: "Figma",
    6: "Premiere Pro",
    7: "Camera Work"
  };

  return (
    <main className="projectContainer">
      <NavBar />
      <div className="projectWrapper">
        
        {/* ========== Project Header ========== */}
        <div className="projectHeader">
          <div className="projectTitleCard">
            <h2 className="projectTitle">{project.projectTitle}</h2>
          </div>

          {/* Skill difficulty cards */}
          <div className="skillsContainer">
            {project.tools.length > 0 ? (
              project.tools.map((tool, index) => (
                <div key={index} className="skillCard">
                  <h4 className="skillName">{toolNames[tool.toolID] || `Tool ${tool.toolID}`}</h4>
                  <p className="skillValue">{tool.difficulty !== null ? tool.difficulty.toFixed(1) : "N/A"}</p>
                </div>
              ))
            ) : (
              <p className="noSkills">No skills assigned to this project.</p>
            )}

            {/* Highlighted average difficulty */}
            <div className="skillCard highlighted">
              <h4 className="skillName">Average</h4>
              <p className="skillValue">{calculateAverageDifficulty()}</p>
            </div>
          </div>
        </div>

        {/* ========== Project Description ========== */}
        <div className="projectDescription">
          <h3 className="descriptionTitle">Project Description:</h3>
          <p className="descriptionText">{project.projectDescription || "No description available."}</p>
        </div>

        {/* ========== Assigned Interns & Leaders ========== */}
        <div className="assignedContainer">
          {/* Interns */}
          <div className="assignedGroup">
            <h3 className="assignedTitle">Assigned Interns</h3>
            <div className="assignedList">
              {project.assignedInterns.length > 0 ? (
                project.assignedInterns
                  .filter(person => person.role === "Intern")
                  .map((intern, index) => (
                    <div key={index} className="assignedPerson">{`${intern.firstName} ${intern.lastName}`}</div>
                  ))
              ) : (
                <p className="noAssigned">No interns assigned.</p>
              )}
            </div>
          </div>

          {/* Leaders */}
          <div className="assignedGroup">
            <h3 className="assignedTitle">Assigned Leaders</h3>
            <div className="assignedList">
              {project.assignedInterns.length > 0 ? (
                project.assignedInterns
                  .filter(person => person.role === "Leader")
                  .map((leader, index) => (
                    <div key={index} className="assignedLeader">{`${leader.firstName} ${leader.lastName}`}</div>
                  ))
              ) : (
                <p className="noAssigned">No leaders assigned.</p>
              )}
            </div>
          </div>
        </div>

        {/* ========== Action Buttons ========== */}
        <div className="buttonContainer">
          <button className="deleteButton" onClick={deleteProject}>
            Delete Project
          </button>
          <button className="completeButton" onClick={completeProject}>
            Mark Complete
          </button>
        </div>

      </div>
    </main>
  );
};

export default ProjectInfoPage;
