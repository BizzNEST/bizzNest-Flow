import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewProject.css';

/**
 * NewProject Component
 * A form that allows users to create a new project by selecting a department,
 * providing a title and description, and assigning tool difficulty levels.
 */
const NewProject = () => {
  // Form input states
  const [projectTitle, setProjectTitle] = useState('');
  const [projectInfo, setProjectInfo] = useState('');
  const [department, setDepartment] = useState('');
  const [toolInputs, setToolInputs] = useState({});

  // UI feedback and form state
  const [statusMessage, setStatusMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // Tool names grouped by department
  const departmentTools = {
    "Web Development": ["Frontend", "Backend", "Wordpress"],
    "Design": ["Photoshop", "Illustrator", "Figma"],
    "Film": ["Premiere Pro", "Camera Work"]
  };

  // Input handlers for project title and description
  const handleProjectTitleChange = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleProjectInfoChange = (event) => {
    setProjectInfo(event.target.value);
  };

  /**
   * Handles department selection
   * Resets the toolInputs object with empty values for tools in the selected department
   */
  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setDepartment(selectedDepartment);

    const selectedTools = departmentTools[selectedDepartment] || [];
    setToolInputs(
      selectedTools.reduce((acc, tool) => {
        acc[tool] = ''; // Initialize difficulty as an empty string
        return acc;
      }, {})
    );
  };

  /**
   * Handles updates to individual tool difficulty fields
   * Parses values into floats, or sets as an empty string
   */
  const handleToolInputChange = (tool, value) => {
    setToolInputs((prevInputs) => ({
      ...prevInputs,
      [tool]: value !== '' ? parseFloat(value) || 0 : '',
    }));
  };

  /**
   * useEffect: Validates form
   * Enables submit button only if all fields and tool inputs are valid
   */
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

  /**
   * Submits form data to the backend API
   * Sends POST request to /addProject and redirects on success
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    // Convert tool input data to array of objects with toolID and difficulty
    const tools = Object.entries(toolInputs).map(([toolName, difficulty]) => {
      const toolID = Object.keys(departmentTools)
        .flatMap((key) => departmentTools[key])
        .indexOf(toolName);

      return {
        toolID: toolID >= 0 ? toolID : null,
        difficulty: parseFloat(difficulty),
      };
    });

    // Final payload to send
    const projectData = {
      projectTitle,
      projectDescription: projectInfo,
      departmentID: Object.keys(departmentTools).indexOf(department),
      tools,
    };

    // POST request to backend
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/addProject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage('Project added successfully!');
        // Navigate to recommendation page with query params
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
        {/* Project Title Input */}
        <input 
          type="text" 
          placeholder="Project Title" 
          value={projectTitle}
          onChange={handleProjectTitleChange}
        />

        {/* Project Info Input */}
        <input 
          type="text" 
          placeholder="Project Info" 
          value={projectInfo}
          onChange={handleProjectInfoChange}
        />

        {/* Department Selection Dropdown */}
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

        {/* Tool Difficulty Inputs */}
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

        {/* Submit Button */}
        <div className="submit-btn-div">
          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid}
            style={{ 
              backgroundColor: isFormValid ? '#00CFFF' : '#045c68',
              cursor: isFormValid ? 'pointer' : 'not-allowed'
            }}
          >
            Submit
          </button>
        </div>

        {/* Status Message (success or error) */}
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default NewProject;
