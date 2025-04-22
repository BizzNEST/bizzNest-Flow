import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Uncomment if navigation is needed later
import NavBar from '../components/Navbar/NavBar.jsx';
import Projects from '../components/Projects/Projects.jsx';
import Metrics from '../components/Metrics/Metrics.jsx';
import NewProject from '../components/NewProject/NewProject.jsx';
import './HomePage.css';

/**
 * HomePage Component
 * This is the main dashboard view, combining navigation,
 * project previews, metrics, and the ability to create a new project.
 */
const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls NavBar mobile menu
  const [showNewProject, setShowNewProject] = useState(false); // Toggle Metrics vs NewProject component

  /**
   * useEffect to handle scroll locking when mobile menu is open
   */
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll'); // Prevent background scrolling
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Clean-up to ensure scroll state resets if component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  return (
    <div className="nav-container">
      {/* Global NavBar with menu toggle support */}
      <NavBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      <div className="homepage-container">
        <div className="content-container">

          {/* Left Side (Projects + New Project Button) */}
          <div className="top-section">
            <Projects />
            <button
              className="create-project-button"
              onClick={() => setShowNewProject(true)}
            >
              New Project
            </button>
          </div>

          {/* Right Side (Metrics by default, NewProject on toggle) */}
          <div className="right-section">
            <div className="dynamic-component">
              {showNewProject ? <NewProject /> : <Metrics />}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
