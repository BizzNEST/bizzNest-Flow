// src/components/NewProject/NewProject.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewProject.css';

const NewProject = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectInfo, setProjectInfo] = useState('');
  const [department, setDepartment] = useState('');
  const [toolInputs, setToolInputs] = useState({});
  const [statusMessage, setStatusMessage] = useState(''); // for displaying success or error messages

  const departmentTools = {
    "Web Development": ["Frontend", "Backend", "Wordpress"],
    "Design": ["Photoshop", "Illustrator", "Figma"],
    "Film": ["Premiere Pro", "Camera Work"]
  };
  // handlers for form fields
  const handleProjectTitleChange = (event) => setProjectTitle(event.target.value);
  const handleProjectInfoChange = (event) => setProjectInfo(event.target.value);
  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
    // Reset tool inputs when department changes
    const selectedTools = departmentTools[event.target.value] || [];
    setToolInputs(
      selectedTools.reduce((acc, tool) => {
        acc[tool] = ''; // Initialize all tools with empty difficulty values
        return acc;
      }, {})
    );
  };

const handleToolInputChange = (tool, value) => {
    setToolInputs((prevInputs) => ({
        ...prevInputs,
        [tool]: value,
    }));
};
  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

  const tools = Object.entries(toolInputs).map(([toolName, difficulty]) => {
    const toolID = Object.keys(departmentTools)
      .flatMap((key) => departmentTools[key])
      .indexOf(toolName);
    return {
      toolID: toolID >= 0 ? toolID : null, // Map toolName to its ID (based on order)
      difficulty: parseFloat(difficulty),
    };
  });

    const projectData = {
      projectTitle,
      projectDescription: projectInfo,
      departmentID: Object.keys(departmentTools).indexOf(department),
      tools,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/addProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage('Project added successfully!');
        console.log('Navigating to recommendations with:', result.projectID, result.departmentID);
        // Note: This can cause cashing issues, not a huge deal, but investigation is needed if app becomes large enough in scale.
        navigate(`recommendations?projectID=${result.projectID}&departmentID=${result.departmentID}`);
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding project: ', error);
      setStatusMessage('An Error occured while adding project');
    }
  };

    //check if all previous fields are filled before displaying skill input
    const areFieldsFilled = projectTitle && projectInfo && department;

  return (
    <div className="new-project-container">
      <form onSubmit={handleSubmit}>
        {/* Add fields for project details */}
        <input 
            type="text" 
            placeholder="Project Title" 
            value={projectTitle}
            onChange={handleProjectTitleChange}
        />

        <input 
            type="text" 
            placeholder="Project Info" 
            value={projectInfo}
            onChange={handleProjectInfoChange}
        />

        {/* Dropdown menu here */}
        <select 
            name="department" 
            className="department-dropdown"
            value={department}
            onChange={handleDepartmentChange}
        >
          <option value="" disabled>
            Department
          </option>
          <option value="Web Development">Web Development</option>
          <option value="Design">Design</option>
          <option value="Film">Film</option>
        </select>

        {/* Conditionally render tool input fields */}
        {areFieldsFilled && (
          <div className="tool-input-container">
            {Object.keys(toolInputs).map((tool) => (
              <div key={tool}>
                <h4>{tool}</h4>
                <input
                  type="number"
                  placeholder="Diff"
                  step="any"
                  min="0"
                  max="10"
                  value={toolInputs[tool]}
                  onChange={(e) => handleToolInputChange(tool, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="submit-btn-div">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
        {/* Display success or error messages */}
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default NewProject;