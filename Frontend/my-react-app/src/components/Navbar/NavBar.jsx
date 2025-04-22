import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import hamburgerIcon from '../../assets/hamburger.png';
import logo from './logo.svg';

/**
 * NavBar Component
 * A responsive navigation bar that shows links directly on desktop
 * and collapses into a hamburger menu on mobile.
 *
 * Hooks Used:
 * - useState: Tracks menu open/close state and screen size.
 * - useEffect: Handles side effects like event listeners for resize and outside clicks.
 * - useRef: References the menu for detecting clicks outside.
 */
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu toggle for mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Responsive breakpoint
  const menuRef = useRef(null); // Ref to detect outside clicks on mobile menu

  /**
   * useEffect - Handle window resize
   * Updates mobile state and closes menu when switching to desktop view.
   */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false); // Auto-close menu when resizing to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * useEffect - Close menu on outside click
   * Listens for mouse clicks and closes the mobile menu if clicked outside.
   */
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
      {/* Logo Section */}
      <div id="logo">
        <img src={logo} alt="bizzNest Flow Logo" className="navbar-logo" />
      </div>

      {/* Navigation Links / Hamburger */}
      <div className="navbar-container">
        {/* Desktop View: Show links inline */}
        {!isMobile ? (
          <ul className="menu-items">
            <li><Link to="/home" className="nav-link">Home</Link></li>
            <li><Link to="/interns" className="nav-link">Interns</Link></li>
            <li><Link to="/CompletedProjects" className="nav-link">Projects</Link></li>
          </ul>
        ) : (
          <>
            {/* Mobile View: Show hamburger icon */}
            <img
              src={hamburgerIcon}
              alt="Menu"
              className="hamburger-icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {/* Conditionally rendered mobile menu */}
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
