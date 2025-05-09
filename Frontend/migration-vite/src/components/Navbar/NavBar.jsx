import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import hamburgerIcon from '../../assets/hamburger.png';
import logo from './logo.svg';
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div id="logo">
        <img src={logo} alt="bizzNest Flow Logo" className="navbar-logo" />
      </div>

      <div className="navbar-container">
        {!isMobile ? (
          <ul className="menu-items">
            <li><Link to="/home" className="nav-link">Home</Link></li>
            <li><Link to="/interns" className="nav-link">Interns</Link></li>
            <li><Link to="/CompletedProjects" className="nav-link">Projects</Link></li>
          </ul>
        ) : (
          <>
            <img
              src={hamburgerIcon}
              alt="Menu"
              className="hamburger-icon"
              onClick={() => setIsMenuOpen(true)}
            />
            {isMenuOpen && (
              <>
              <FocusLock returnFocus={true}>
                <RemoveScroll>
                  <div className="drawer-backdrop" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="sliding-drawer">
                    <button className="nav-close-btn" onClick={() => setIsMenuOpen(false)}>✕</button>
                    <ul className="drawer-links">
                      <li><Link to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                      <li><Link to="/interns" onClick={() => setIsMenuOpen(false)}>Interns</Link></li>
                      <li><Link to="/CompletedProjects" onClick={() => setIsMenuOpen(false)}>Projects</Link></li>
                    </ul>
                  </div>
                </RemoveScroll>
              </FocusLock>
                
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
