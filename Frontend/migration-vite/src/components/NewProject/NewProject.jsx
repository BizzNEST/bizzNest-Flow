import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewProject.css';

const NewProject = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectInfo, setProjectInfo] = useState('');
  const [department, setDepartment] = useState('');
  const [toolInputs, setToolInputs] = useState({});
  const [statusMessage, setStatusMessage] = useState(''); // for displaying success or error messages
  const [isFormValid, setIsFormValid] = useState(false);

  const departmentTools = {
    "Web Development": ["Frontend", "Backend", "Wordpress"],
    "Design": ["Photoshop", "Illustrator", "Figma"],
    "Film": ["Premiere Pro", "Camera Work"]
  };

  const navigate = useNavigate();

  // Handlers for form fields
  const handleProjectTitleChange = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleProjectInfoChange = (event) => {
    setProjectInfo(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setDepartment(selectedDepartment);

    // Reset tool inputs when department changes
    const selectedTools = departmentTools[selectedDepartment] || [];
    setToolInputs(
      selectedTools.reduce((acc, tool) => {
        acc[tool] = ''; // Initialize with empty difficulty values
        return acc;
      }, {})
    );
  };

  const handleToolInputChange = (tool, value) => {
    setToolInputs((prevInputs) => ({
      ...prevInputs,
      [tool]: value !== '' ? parseFloat(value) || 0 : '',
    }));
  };

  // Ensure form is valid before enabling the submit button
  useEffect(() => {
    const areAllFieldsFilled =
      projectTitle.trim().length > 0 &&
      projectInfo.trim().length > 0 &&
      department !== '';

    const areAllToolsFilled =
      Object.keys(toolInputs).length > 0 &&
      Object.values(toolInputs).every(value => value !== '' && !isNaN(value));

    setIsFormValid(areAllFieldsFilled && areAllToolsFilled);
  }, [projectTitle, projectInfo, department, toolInputs]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) return; // Prevent submission if form is invalid

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/addProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage('Project added successfully!');
        navigate(`/recommendations?projectID=${result.projectID}&departmentID=${result.departmentID}`);
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding project: ', error);
      setStatusMessage('An error occurred while adding the project');
    }
  };

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
          <option value="" disabled>Department</option>
          <option value="Web Development">Web Development</option>
          <option value="Design">Design</option>
          <option value="Film">Film</option>
        </select>

        {/* Conditionally render tool input fields */}
        {department && (
          <div className="tool-input-container">
            {Object.keys(toolInputs).map((tool) => (
              <div key={tool}>
                <h4>{tool}</h4>
                <input
                  type="number"
                  placeholder="Difficulty (0-10)"
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
          {/* Button will be disabled if form is not valid */}
          <button type="submit" className="submit-btn" disabled={!isFormValid} style={{ 
            backgroundColor: isFormValid ? '#00CFFF' : '#045c68 ', 
            cursor: isFormValid ? 'pointer' : 'not-allowed' 
          }}>
            Submit
          </button>
        </div>

        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default NewProject;
