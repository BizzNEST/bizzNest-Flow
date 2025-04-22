import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar.jsx';
import './Recommendations.css';

/**
 * This component fetches and displays intern recommendations for a given project,
 * allowing users to assign interns or leaders based on skill growth predictions.
 */
const Recommendations = () => {
  // Core state variables
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [groupedInterns, setGroupedInterns] = useState({});
  const [isAscending, setIsAscending] = useState(false); // Toggle view mode
  const [animationKey, setAnimationKey] = useState(0);   // Helps trigger animations
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [selectedLeaders, setSelectedLeaders] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch recommendations once on load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const projectID = queryParams.get('projectID');
    const departmentID = queryParams.get('departmentID');

    if (!projectID || !departmentID) {
      setError('Missing projectID or departmentID in the URL');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/recommendations?projectID=${projectID}&departmentID=${departmentID}`
        );
        const result = await response.json();

        if (response.ok) {
          setData(result);
          groupAndSortInterns(result, false); // Default: Optimized Learning (Descending)
        } else {
          setError(result.message || 'Error fetching recommendations');
        }
      } catch (err) {
        setError('Failed to fetch recommendations');
      }
    };

    fetchRecommendations();
  }, [location.search]);

  /**
   * Groups interns by toolID and sorts based on toggle state (ascending/descending).
   */
  const groupAndSortInterns = (data, ascending) => {
    const grouped = {};

    data.skillDifferences.forEach(intern => {
      intern.calculations.forEach(calc => {
        const toolID = calc.toolID;
        if (!grouped[toolID]) grouped[toolID] = [];

        grouped[toolID].push({
          internID: intern.InternID,
          name: `${intern.firstName} ${intern.lastName}`,
          percentIncrease: calc.percentIncrease,
          eligibleForLeadership: calc.eligibleForLeadership,
        });
      });
    });

    // Sorting logic
    Object.keys(grouped).forEach(toolID => {
      grouped[toolID].sort((a, b) => {
        if (ascending) {
          if (a.eligibleForLeadership !== b.eligibleForLeadership) {
            return b.eligibleForLeadership - a.eligibleForLeadership;
          }
          return a.percentIncrease - b.percentIncrease;
        } else {
          return b.percentIncrease - a.percentIncrease;
        }
      });
    });

    setGroupedInterns(grouped);
  };

  // Toggle intern/leader selection
  const toggleSelectIntern = (internID) => {
    if (selectedInterns.includes(internID)) {
      setSelectedInterns(selectedInterns.filter(id => id !== internID));
    } else if (selectedLeaders.includes(internID)) {
      setSelectedLeaders(selectedLeaders.filter(id => id !== internID));
    } else {
      setSelectedInterns([...selectedInterns, internID]);
    }
  };

  const toggleLeader = (internID) => {
    if (selectedLeaders.includes(internID)) {
      setSelectedLeaders(selectedLeaders.filter(id => id !== internID));
      setSelectedInterns([...selectedInterns, internID]);
    } else {
      setSelectedInterns(selectedInterns.filter(id => id !== internID));
      setSelectedLeaders([...selectedLeaders, internID]);
    }
  };

  const toggleOrder = () => {
    const newOrder = !isAscending;
    setIsAscending(newOrder);
    groupAndSortInterns(data, newOrder);
    setAnimationKey(prevKey => prevKey + 1);
  };

  // Submit selected interns/leaders to backend
  const submitInterns = async () => {
    const queryParams = new URLSearchParams(location.search);
    const projectID = queryParams.get("projectID");

    if (!selectedInterns.length && !selectedLeaders.length) {
      alert("No interns or leaders selected!");
      return;
    }

    const payload = [
      ...selectedInterns.map(id => ({ internID: id, projectID, role: "Intern" })),
      ...selectedLeaders.map(id => ({ internID: id, projectID, role: "Leader" }))
    ];

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/assignIntern`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSelectedInterns([]);
        setSelectedLeaders([]);
        navigate("/home");
      } else {
        const errorText = await response.text();
        console.error("Failed to assign:", errorText);
        alert("Failed to assign interns/leaders.");
      }
    } catch (error) {
      console.error("Error assigning interns/leaders:", error);
    }
  };

  // Tool label map
  const toolNames = {
    0: "Frontend", 1: "Backend", 2: "Wordpress", 3: "Photoshop",
    4: "Illustrator", 5: "Figma", 6: "Premiere Pro", 7: "Camera Work"
  };

  // Background gradients
  const getBackgroundGradient = (percent) => {
    if (percent >= 5) return 'linear-gradient(to bottom, #356086, #25FFC1)';
    if (percent >= 0) return 'linear-gradient(to bottom,rgb(206, 91, 42),rgb(251, 179, 45))';
    return 'linear-gradient(to bottom,rgb(174, 40, 40), #EF2BD2)';
  };

  const getBackgroundGradientForLeaders = (percent, eligible) => {
    return eligible
      ? 'linear-gradient(to bottom, #356086, #25FFC1)'
      : 'linear-gradient(to bottom,rgb(174, 40, 40), #EF2BD2)';
  };

  // Handle loading and error
  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading recommendations...</p>;

  return (
    <div className="recommendations-container">
      <NavBar />

      {/* Project Info */}
      <div className="project-stats">
        <div className="project-title">
          <div className="title-box">{data.projects[0]?.projectTitle || 'N/A'}</div>
        </div>

        <div className="difficulty">
          {data.projects[0]?.tools?.map((tool, index) => (
            <div key={index} className="tool-box">
              <h4>{toolNames[tool.toolID]}</h4>
              <div className="tool-boxes">{tool.difficulty.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="average-difficulty">
          <h4>Average</h4>
          <div className="avg-box">
            {(
              data.projects[0].tools.reduce((sum, t) => sum + t.difficulty, 0) /
              data.projects[0].tools.length
            ).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="recommendations-header">
        <h2>
          Recommended for{' '}
          <span style={{ color: '#25FFC1' }}>
            {isAscending ? 'Project Leadership' : 'Optimized Learning'}
          </span>
        </h2>
      </div>

      {/* Recommendations by tool */}
      <div className="suggestions-container">
        {data.projects[0]?.tools?.map((tool, index) => (
          <div key={index} className={`tool-row-${index + 1}`}>
            <h3 className="tool-header">{toolNames[tool.toolID]}</h3>
            <div className="tablet-rows">
              <div className="row-tablets">
                {groupedInterns[tool.toolID]?.map((intern, idx) => (
                  <div
                    key={`${animationKey}-${idx}`}
                    className={`tablet ${
                      selectedInterns.includes(intern.internID)
                        ? "selected"
                        : selectedLeaders.includes(intern.internID)
                        ? "leader-selected"
                        : ""
                    }`}
                    style={{
                      background: isAscending
                        ? getBackgroundGradientForLeaders(intern.percentIncrease, intern.eligibleForLeadership)
                        : getBackgroundGradient(intern.percentIncrease),
                    }}
                  >
                    <div className="tablet-name">{intern.name}</div>
                    <div className="tablet-percent">
                      {isAscending
                        ? `${-intern.percentIncrease}%`
                        : `${intern.percentIncrease}%`}
                    </div>
                    <button
                      className="assign-button"
                      onClick={() => toggleSelectIntern(intern.internID)}
                    >
                      {selectedInterns.includes(intern.internID) ? "Intern ✔" : "Assign"}
                    </button>
                    {intern.eligibleForLeadership && (
                      <button
                        className="leader-button"
                        onClick={() => toggleLeader(intern.internID)}
                      >
                        {selectedLeaders.includes(intern.internID) ? "Leader ⭐" : "Make Leader"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons Section */}
      <div className="buttons-container">
        <div className="switch-button">
          <label className="switch">
            <input type="checkbox" checked={isAscending} onChange={toggleOrder} />
            <span className="slider round"></span>
          </label>
          <p>Toggle to Potential Leaders</p>
        </div>

        <div className="recommendationSubmitButton">
          <button className="submit" onClick={submitInterns}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
