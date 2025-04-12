import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar/NavBar"; // Import the NavBar component
import growth from "../assets/growth.svg";
import returnArrow from "../assets/returnArrow.svg";
import './EditIntern.css';

const skillLabels = {
  0: ["Frontend", "Backend", "Wordpress"],
  1: ["Photoshop", "Illustrator", "Figma"],
  2: ["Premiere Pro", "Camera Work"],
};

const EditIntern = () => {
  const { internID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    departmentID: "",
    skills: {}, // Skills are dynamically rendered based on department
  });

  const [originalData, setOriginalData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdated, setIsUpdated] = useState(false); // Track if anything was updated

  useEffect(() => {
    const fetchInternData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/getIntern/${internID}`);
        if (response.ok) {
          const data = await response.json();

          // Map skills from the fetched data
          const skillsMap = data.skills.reduce((acc, skill) => {
            acc[skill.toolID] = skill.skillLevel || 0; // Default to 0 for missing values
            return acc;
          }, {});

          const internData = {
            firstName: data.firstName,
            lastName: data.lastName,
            location: data.location,
            departmentID: data.departmentID,
            skills: skillsMap,
          };

          // Set the formData state with the fetched data
          setFormData(internData);
          setOriginalData(internData);
        } else {
          console.error("Failed to fetch intern data");
        }
      } catch (error) {
        console.error("Error fetching intern:", error);
      }
    };

    fetchInternData();
  }, [internID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("skill_")) {
      const toolID = name.split("_")[1];
      setFormData({
        ...formData,
        skills: { ...formData.skills, [toolID]: Number(value) },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setIsUpdated(true); // Enable the button when something changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
        departmentID: formData.departmentID,
        webDevSkills: Object.fromEntries(
          Object.entries(formData.skills).filter(([toolID]) => Number(toolID) >= 0 && Number(toolID) <= 2)
        ),
        designSkills: Object.fromEntries(
          Object.entries(formData.skills).filter(([toolID]) => Number(toolID) >= 3 && Number(toolID) <= 5)
        ),
        filmSkills: Object.fromEntries(
          Object.entries(formData.skills).filter(([toolID]) => Number(toolID) >= 6 && Number(toolID) <= 7)
        )
      };

      const hasExistingSkills = Object.values(formData.skills).some(skillLevel => skillLevel > 0);

      let response;
      if (hasExistingSkills) {
        response = await fetch(`${import.meta.env.VITE_API_URL}/updateIntern/${internID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/addSkills/${internID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        setSuccessMessage("Intern updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
        setIsUpdated(false); // Disable the button after successful update
      } else {
        alert("Failed to update or add skills");
      }
    } catch (error) {
      console.error("Error updating or adding skills:", error);
      alert("Error updating or adding skills.");
    }
  };

  const calculateAverageSkill = () => {
    const skillValues = Object.values(formData.skills);
    if (skillValues.length === 0) return 0;

    const total = skillValues.reduce((acc, skill) => acc + skill, 0);
    return Math.round((total / skillValues.length) * 10) / 10;
  };

  const departmentSkills = skillLabels[formData.departmentID] || [];

  const handleBack = () => {
    if (originalData) {
      setFormData(originalData);
    }
    navigate('/interns');
  };

  return (
    <div className="big-container">
      <NavBar /> {/* Add NavBar at the top */}
      <div className="editInternContainer">
        <div className="formWrapper">
          <div className="editInternHeaderWrapper">
            <button className="back-button" onClick={handleBack}>
              <img src={returnArrow} alt="Back" />
            </button>
            <button 
              className="growth-button" 
              onClick={(e) => { 
                e.stopPropagation(); 
                navigate(`/internGrowthPage/${internID}`); 
              }}
            >
              <img src={growth} alt="growth" />
              <span>Intern Growth</span>
            </button>
          </div>
          <h2 className="editInternHeader">Edit Intern</h2>

          {successMessage && (
            <div className="successPopup">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="editInternForm">
            <div className="updateNameContainer">
              <label>
                <h3>First Name</h3>
                <input
                  type="text"
                  name="firstName"
                  className="editInternInput"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </label>
              <label>
                <h3>Last Name</h3>
                <input
                  type="text"
                  name="lastName"
                  className="editInternInput"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="updateLocationDepartmentContainer">
              <label>
                <h3>Location</h3>
                <select className="editInternSelector" name="location" value={formData.location} onChange={handleChange}>
                  <option value="">Select a location</option>
                  <option value="Salinas">Salinas</option>
                  <option value="Gilroy">Gilroy</option>
                  <option value="Watsonville">Watsonville</option>
                  <option value="Stockton">Stockton</option>
                  <option value="Modesto">Modesto</option>
                </select>
              </label>
              <label>
                <h3>Department</h3>
                <select className="editInternSelector" name="departmentID" value={formData.departmentID} onChange={handleChange}>
                  <option value="">Select a department</option>
                  <option value="0">Web Development</option>
                  <option value="1">Design</option>
                  <option value="2">Film</option>
                </select>
              </label>
            </div>

            <div className="updateSkillLevelContainer">
              <h3>Skill Levels</h3>
              <div className="departmentSkillLevelsContainer">
                {departmentSkills.map((label, index) => {
                  const toolID = Object.keys(skillLabels).find(
                    (key) => skillLabels[key].includes(label)
                  ) * 3 + index;
                  return (
                    <label key={toolID} className="skillItem">
                      {label} Skill:
                      <input
                        type="number"
                        className="editInternSkillInput"
                        name={`skill_${toolID}`}
                        value={(formData.skills[toolID] || 0).toFixed(1)}
                        onChange={handleChange}
                      />
                    </label>
                  );
                })}
                <div className="averageSkillBlock">
                  Overall: <div className="averageValue">{calculateAverageSkill()}</div>
                </div>
              </div>
            </div>

            <div className="buttonsContainer">
              <button className="updateInternButton" type="submit" disabled={!isUpdated}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditIntern;