import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
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
    <nav className={styles.navBar}>
      <div id="logo">
        <img src={logo} alt="bizzNest Flow Logo" className={styles.navBarLogo} />
      </div>

      <div className={styles.navBarContainer}>
        {!isMobile ? (
          <ul className={styles.menuItems}>
            <li><Link to="/home" className={styles.navLink}>Home</Link></li>
            <li><Link to="/interns" className={styles.navLink}>Interns</Link></li>
            <li><Link to="/CompletedProjects" className={styles.navLink}>Projects</Link></li>
          </ul>
        ) : (
          <>
            <img
              src={hamburgerIcon}
              alt="Menu"
              className={styles.hamburgerIcon}
              onClick={() => setIsMenuOpen(true)}
            />
            {isMenuOpen && (
              <>
              <FocusLock returnFocus={true}>
                <RemoveScroll>
                  <div className={styles.drawerBackDrop} onClick={() => setIsMenuOpen(false)}></div>
                  <div className={styles.slidingDrawer}>
                    <button className={styles.navCloseBtn} onClick={() => setIsMenuOpen(false)}>✕</button>
                    <ul className={styles.drawerLinks}>
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
