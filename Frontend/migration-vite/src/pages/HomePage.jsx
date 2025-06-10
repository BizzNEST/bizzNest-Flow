import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar.jsx';
import Projects from '../components/Projects/Projects.jsx';
import Metrics from '../components/Metrics/Metrics.jsx';
import NewProject from '../components/NewProject/NewProject.jsx';
import './HomePage.css';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showNewProject, setShowNewProject] = useState(false); // state to toggle components

  useEffect(() => {
    // Add/remove 'no-scroll' class to body based on menu state
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);
  return (
    <div className="nav-container">
      <NavBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
    <div className="homepage-container">
      <div className="content-container">
        <div className="top-section">
        {/* Projects Section - Top */}
        <Projects />
        <button
              className="create-project-button"
              onClick={() => setShowNewProject(true)}>
              New Project
          </button>
          </div>
        {/* Dynamic component - Metrics / NewProject */}
        <div className="right-section">
          <div className="dynamic-component">
          {/* Conditionally render components */}
          {showNewProject ? <NewProject /> : <Metrics />}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;
