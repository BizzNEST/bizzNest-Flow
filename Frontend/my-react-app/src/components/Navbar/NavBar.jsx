import React, { useState, useEffect, useRef } from 'react';

import { Link } from 'react-router-dom';
import './NavBar.css';
import hamburgerIcon from '../../assets/hamburger.png';
import logo from './logo.svg'


// hooks explained:

// useEffect is a React hook that allows you to perform side effects in functional components
// * adding event listeners
// * Fetching data
// * Interacting with the DOM
// * Cleaning up resouces

// useRef is a hook that creates a "reference" to a DOM element or value that persists across renders.
// * Directly accessing DOM elements
// * Storing mutable values that don't trigger a re-render when updated.


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);

  // Function to check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false); // Ensure menu is closed when switching to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div id="logo">
      <img src={logo} alt="bizzNest Flow Logo" className="navbar-logo" />
      </div>
      
      <div className="navbar-container">
        {/* Show Links Directly on Desktop, Show Hamburger on Mobile */}
        {!isMobile ? (
          <ul className="menu-items">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/interns" className="nav-link">Interns</Link></li>
            <li><Link to="/CompletedProjects" className="nav-link">Projects</Link></li>
          </ul>
        ) : (
          <>
            <img
              src={hamburgerIcon}
              alt="Menu"
              className="hamburger-icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <ul ref={menuRef} className="menu-items mobile-menu">
                <li><Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                <li><Link to="/interns" className="nav-link" onClick={() => setIsMenuOpen(false)}>Interns</Link></li>
                <li><Link to="/CompletedProjects" className="nav-link" onClick={() => setIsMenuOpen(false)}>Projects</Link></li>
              </ul>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;