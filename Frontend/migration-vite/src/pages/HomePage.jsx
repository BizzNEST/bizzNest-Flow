import React, { useState, useEffect } from 'react';
import NavBar from '../components/Navbar/NavBar.jsx';
import Projects from '../components/Projects/Projects.jsx';
import Metrics from '../components/Metrics/Metrics.jsx';
import NewProject from '../components/NewProject/NewProject.jsx';
import styles from './HomePage.module.css';

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
    <div className={styles.navContainer}>
      <NavBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
    <div className={styles.homepageContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.topSection}>
        {/* Projects Section - Top */}
        <Projects />
        <button
              className={styles.createProjectButton}
              onClick={() => setShowNewProject(true)}>
              New Project
          </button>
          </div>
        {/* Dynamic component - Metrics / NewProject */}
        <div className={styles.rightSection}>
          <div className={styles.dynamicComponent}>
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
