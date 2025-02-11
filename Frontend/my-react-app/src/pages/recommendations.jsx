import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar.jsx';
import './Recommendations.css';

const Recommendations = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [groupedInterns, setGroupedInterns] = useState({});
  const [isAscending, setIsAscending] = useState(false); // Track toggle state
  const [animationKey, setAnimationKey] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const projectID = queryParams.get('projectID');
    const departmentID = queryParams.get('departmentID');

    console.log('Query Parameters:', { projectID, departmentID });

    if (!projectID || !departmentID) {
      setError('Missing projectID or departmentID in the URL');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3360/recommendations?projectID=${projectID}&departmentID=${departmentID}`
        );
        const result = await response.json();

        if (response.ok) {
          setData(result);
          groupAndSortInterns(result, false); // Initialize with descending order
        } else {
          setError(result.message || 'Error fetching recommendations');
        }
      } catch (err) {
        setError('Failed to fetch recommendations');
      }
    };

    fetchRecommendations();
  }, [location.search]);

  const groupAndSortInterns = (data, ascending) => {
    const grouped = {};

    data.skillDifferences.forEach(intern => {
      intern.calculations.forEach(calc => {
        const toolID = calc.toolID;
        if (!grouped[toolID]) {
          grouped[toolID] = [];
        }
        grouped[toolID].push({
          internID: intern.InternID,
          name: `${intern.firstName} ${intern.lastName}`,
          percentIncrease: calc.percentIncrease,
        });
      });
    });

    // Sort each group
    Object.keys(grouped).forEach(toolID => {
      grouped[toolID].sort((a, b) =>
        ascending
          ? a.percentIncrease - b.percentIncrease
          : b.percentIncrease - a.percentIncrease
      );
    });

    setGroupedInterns(grouped);
  };

  const toggleOrder = () => {
    const newOrder = !isAscending; // Toggle state
    setIsAscending(newOrder);
    groupAndSortInterns(data, newOrder);
    // Increment animationKey to trigger re-render and re-animation
    setAnimationKey((prevKey) => prevKey + 1);
  };

  const assignIntern = async (internID) => {
    console.log("🧐 Debug: Received internID ->", internID); // Debugging
    
    try {
      const queryParams = new URLSearchParams(location.search);
      const projectID = queryParams.get('projectID');
  
      if (!internID) {
        console.error("❌ InternID is undefined! Cannot assign intern.");
        alert("Error: Intern ID is missing.");
        return;
      }
  
      if (!projectID) {
        alert("Error: Project ID is missing.");
        return;
      }
  
      const payload = {
        internID,
        projectID,
        role: "Intern",
      };
  
      console.log("📤 Sending payload:", payload); // Debugging
  
      const response = await fetch("http://localhost:3360/assignIntern", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("✅ Intern assigned successfully!");
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to assign intern:", errorText);
        alert("Failed to assign intern.");
      }
    } catch (error) {
      console.error("❌ Error assigning intern:", error);
    }
  };
  

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

  const getBackgroundGradient = (percentIncrease) => {
    if (percentIncrease >= 20) {
      return 'linear-gradient(to bottom, #356086, #25FFC1)'; // Green gradient
    }
    if (percentIncrease > 0) {
      return 'linear-gradient(to bottom,rgb(206, 91, 42),rgb(251, 179, 45))'; // Yellow gradient
    }
    return 'linear-gradient(to bottom,rgb(174, 40, 40), #EF2BD2)'; // Red gradient
  };

  const getBackgroundGradientForLeaders = (percentIncrease) => {
    if (percentIncrease <= 0) {
      return 'linear-gradient(to bottom, #356086, #25FFC1)'; // Green gradient
    }
    if (percentIncrease < 20 && percentIncrease > 0) {
      return 'linear-gradient(to bottom,rgb(206, 91, 42),rgb(251, 179, 45))'; // Yellow gradient
    }
    return 'linear-gradient(to bottom,rgb(174, 40, 40), #EF2BD2)'; // Red gradient
  };

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading recommendations...</p>;

  return (
    <div className="recommendations-container">
      <NavBar />
      <div className="project-stats">
        <div className="project-title">
          <div className="title-box">{data.projects[0]?.projectTitle || 'N/A'}</div>
        </div>
        <div className="difficulty">
          {data.projects[0]?.tools?.map((tool, index) => (
            <div key={index} className="tool-box">
              <h4>{`${toolNames[tool.toolID]}`}</h4>
              <div className="tool-boxes">{parseFloat(tool.difficulty.toFixed(2))}</div>
            </div>
          ))}
        </div>
        <div className="average-difficulty">
          <h4>Average</h4>
          <div className="avg-box">
            {(
              data.projects[0].tools.reduce((acc, tool) => acc + tool.difficulty, 0) /
              data.projects[0].tools.length
            ).toFixed(1)}
          </div>
        </div>
      </div>
      <div className="recommendations-header">
  <h2>
    Recommended for{' '}
    <span style={{ color: '#25FFC1' }}>
      {isAscending ? 'Project Leadership' : 'Optimized Learning'}
    </span>
  </h2>
</div>

      <div className="suggestions-container">
        {data.projects[0]?.tools?.map((tool, index) => (
          <div key={index} className={`tool-row-${index + 1}`}>
            <h3 className="tool-header">{toolNames[tool.toolID] || 'Unknown Tool'}</h3>
            <div className="tablet-rows">
              <div className="row-tablets">
                {groupedInterns[tool.toolID]?.map((intern, idx) => (
                  <div 
                  key={`${animationKey}-${idx}`}
                    className="tablet"
                    style={{ 
                      background: isAscending
                      ? getBackgroundGradientForLeaders(intern.percentIncrease)
                      : getBackgroundGradient(intern.percentIncrease),
                      animationDelay: `${idx * 0.05}s`, // Stagger animations
                     }}
                  >
                    <div className="tablet-name">{intern.name}</div>
                    <div className="tablet-percent">
                        {isAscending 
                          ? `${-(intern.percentIncrease)}%` // Convert signs for leadership view
                          : `${(intern.percentIncrease)}%` // Convert signs for optimized learning view
                        }
                      </div>
                      <button className="assign-button" onClick={() => assignIntern(intern.internID)}>
                        Assign
                      </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="buttons-container">
        <div className="switch-button">
          <label className="switch">
            <input 
              type="checkbox"
              checked={isAscending}
              onChange={toggleOrder}
            />
            <span className="slider round"></span>
          </label>
          <p>Toggle to Potential Leaders</p>
        </div>
        <div className="submit-button">
          <button className="submit">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;