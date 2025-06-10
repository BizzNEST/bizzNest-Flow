import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";
import users from "../assets/users.svg";
import Logo from "../assets/bizznestflowlow-black-logo.svg";
import chartline from "../assets/chart-line.svg";
import database from "../assets/database.svg";
import zap from "../assets/zap.svg";
import piechart from "../assets/chart-pie.svg";
import chartColumn from "../assets/chart-column.svg";
import hero2 from "../assets/graphsHero.svg";
import menuIcon from "../assets/menu.svg";
import closeIcon from "../assets/close.svg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <div className={styles.landingPageWrapper}>
      {/* Header */}
      <header className={styles.landingHeader}>
        <div className={styles.logoLandingPageContainer}>
          <img src={Logo} alt="Logo" />
        </div>

        <nav className={`${styles.landingPageNav} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
        </nav>

        <button className={styles.landingPageGetStarted} onClick={() => navigate("/loginsignup")}>
          GET STARTED
        </button>

        <button className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
          <img src={mobileMenuOpen ? closeIcon : menuIcon} alt="menu" />
        </button>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>
            Optimize Your <span className={styles.highlight}>Talent Growth</span> Journey
          </h1>
          <p>
            Match the right interns with the right projects using our intelligent data-driven platform that
            maximizes learning and identifies future leaders.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.heroBttn} onClick={() => navigate("/loginsignup")}>Start Optimizing Today</button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src="/dataGraphic.svg" alt="bizzNest Flow Dashboard" />
        </div>
      </section>

      {/* Info Section */}
      <div className={styles.landingPageHero}>
        <div className={styles.learnMoreLandingPage}>
          <h1>bizzNest Flow</h1>
          <p>
            bizzNest Flow is an intelligent growth optimizer that helps admins
            assign interns to projects based on their skill level and the
            project's difficulty. Using a data-driven approach, it ensures
            interns are placed in roles that maximize their learning while
            identifying ideal candidates for leadership opportunities.
          </p>
        </div>
        <img className={styles.hero2} src={hero2} alt="graph" />
      </div>

      {/* Features */}
      <section id="features" className={styles.features}>
        <h1 className={styles.featuresHeader}>Powerful Features</h1>
        <p className={styles.sectionDescription}>Our platform offers a comprehensive suite of tools designed to optimize your talent management process.</p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconContainerGreen}>
              <img src={users} alt="users" />
            </div>
            <h3>Skill Matching</h3>
            <p>Automatically match interns with projects that align with their skill level and learning goals.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconContainerPink}>
              <img src={chartline} alt="chartline" />
            </div>
            <h3>Growth Analytics</h3>
            <p>Track and visualize intern progress over time with comprehensive performance metrics.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconContainerGreen}>
              <img src={database} alt="database" />
            </div>
            <h3>Data-Driven Insights</h3>
            <p>Make informed decisions based on real-time data and predictive analytics.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconContainerPink}>
              <img src={zap} alt="zap" />
            </div>
            <h3>Leadership Identification</h3>
            <p>Automatically identify interns with leadership potential based on performance metrics.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconContainerGreen}>
              <img src={piechart} alt="piechart" />
            </div>
            <h3>Project Difficulty Assessment</h3>
            <p>Evaluate and categorize projects based on complexity and required skills.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconContainerPink}>
              <img src={chartColumn} alt="chartColumn" />
            </div>
            <h3>Performance Reporting</h3>
            <p>Generate comprehensive reports on individual and team performance with a single click.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.howItWorksContainer}>
          <div className={styles.textCenter}>
            <h2 className={styles.howItWorksTitle}>How It Works</h2>
            <p className={styles.howItWorksSubtitle}>Get started with bizzNest Flow in just a few simple steps</p>
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.stepCard}>
              <div className={`${styles.stepNumber} ${styles.stepGreen}`}>1</div>
              <h3>Input Data</h3>
              <p>Add your interns' profiles and project requirements to the platform.</p>
            </div>
            <div className={styles.stepArrow}>➡</div>
            <div className={styles.stepCard}>
              <div className={`${styles.stepNumber} ${styles.stepPink}`}>2</div>
              <h3>Algorithm Matches</h3>
              <p>Our algorithm analyzes the data and creates optimal intern-project pairings.</p>
            </div>
            <div className={styles.stepArrow}>➡</div>
            <div className={styles.stepCard}>
              <div className={`${styles.stepNumber} ${styles.stepGreen}`}>3</div>
              <h3>Track & Optimize</h3>
              <p>Monitor progress, gather insights, and continuously improve your talent development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerRights}>© 2025 bizzNest Flow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
