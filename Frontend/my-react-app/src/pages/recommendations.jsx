import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar.jsx';
import './Recommendations.css';

const Recommendations = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
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
        } else {
          setError(result.message || 'Error fetching recommendations');
        }
      } catch (err) {
        setError('Failed to fetch recommendations');
      }
    };

    fetchRecommendations();
  }, [location.search]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading recommendations...</p>;

  // Group interns by tools using skillDifferences
  const groupedInterns = {};
  data.skillDifferences.forEach(intern => {
    intern.calculations.forEach(calc => {
      const toolID = calc.toolID;
      if (!groupedInterns[toolID]) {
        groupedInterns[toolID] = [];
      }
      groupedInterns[toolID].push({
        name: `${intern.firstName} ${intern.lastName}`,
        percentIncrease: calc.percentIncrease,
      });
    });
  });

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
              <h4>{`Tool ${tool.toolID}`}</h4>
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

      <div className="suggestions-container">
        {data.projects[0]?.tools?.map((tool, index) => (
          <div key={index} className={`row-${index + 1}`}>
            <div className="row-tablets">
              {groupedInterns[tool.toolID]?.map((intern, idx) => (
                <div key={idx} className="tablet">
                  <div className="tablet-name">{intern.name}</div>
                  <div className="tablet-percent">{`${intern.percentIncrease}%`}</div>
                  <button className="assign-button">Assign</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;