import React from "react";
import { data, useNavigate } from "react-router-dom";
import "./LandingPage.css";
import users from "../assets/users.svg";
import Logo from "../assets/bizznestflowlow-black-logo.svg";
import chartline from "../assets/chart-line.svg";
import database from "../assets/database.svg";
import zap from "../assets/zap.svg";
import piechart from "../assets/chart-pie.svg";
import chartColumn from "../assets/chart-column.svg";
import hero2 from "../assets/graphsHero.svg";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landingPageWrapper">
      {/* Header*/}
      <header className="landingHeader">
        <div className="logoLandingPageContainer">
          <img src={Logo} alt="Logo" />
        </div>
        <nav className="landingPageNav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </nav>
        <button className="landingPageGetStarted" onClick={() => navigate("/loginsignup")}>GET STARTED</button>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="heroText">
          <h1>
            Optimize Your <span className="highlight">Talent Growth</span>{" "}
            Journey
          </h1>
          <p>
            Match the right interns with the right projects using our
            intelligent data-driven platform that maximizes learning and
            identifies future leaders.
          </p>
          <div className="heroButtons">
            <button className="heroBttn" onClick={() => navigate("/loginsignup")}>Start Optimizing Today</button>
          </div>
        </div>
        <div className="heroImage">
          <img src={"/dataGraphic.svg"} alt="bizzNest Flow Dashboard" />
        </div>
      </section>

      {/* info */}
      <div className="landingPageHero">
        <div className="learnMoreLandingPage">
          <h1>bizzNest Flow</h1>
          <p>
            bizzNest Flow is an intelligent growth optimizer that helps admins
            assign interns to projects based on their skill level and the
            project's difficulty. Using a data-driven approach, it ensures
            interns are placed in roles that maximize their learning while
            identifying ideal candidates for leadership opportunities.
          </p>
        </div>
        <img className="hero2" src={hero2} alt="graph" />
      </div>

      {/* Features Section */}
      <section id="features" className="features">
        <h1 className="featuresHeader">Powerful Features</h1>
        <p className="sectionDescription">
          Our platform offers a comprehensive suite of tools designed to
          optimize your talent management process.
        </p>

        <div className="featuresGrid">
          <div className="featureCard">
            <div className="iconContainerGreen">
              <img src={users} alt="users" className="usersIcon" />
            </div>

            <h3>Skill Matching</h3>
            <p>
              Automatically match interns with projects that align with their
              skill level and learning goals.
            </p>
          </div>
          <div className="featureCard">
            <div className="iconContainerPink">
              <img src={chartline} alt="chartline" />
            </div>
            <h3>Growth Analytics</h3>
            <p>
              Track and visualize intern progress over time with comprehensive
              performance metrics.
            </p>
          </div>
          <div className="featureCard">
            <div className="iconContainerGreen">
              <img src={database} alt="database" />
            </div>
            <h3>Data-Driven Insights</h3>
            <p>
              Make informed decisions based on real-time data and predictive
              analytics.
            </p>
          </div>
          <div className="featureCard">
            <div className="iconContainerPink">
              <img src={zap} alt="zap" />
            </div>
            <h3>Leadership Identification</h3>
            <p>
              Automatically identify interns with leadership potential based on
              performance metrics.
            </p>
          </div>
          <div className="featureCard">
            <div className="iconContainerGreen">
              <img src={piechart} alt="piechart" />
            </div>
            <h3>Project Difficulty Assessment</h3>
            <p>
              Automatically evaluate and categorize projects based on complexity
              and required skills.
            </p>
          </div>
          <div className="featureCard">
            <div className="iconContainerPink">
              <img src={chartColumn} alt="chartColumn" />
            </div>
            <h3>Performance Reporting</h3>
            <p>
              Generate comprehensive reports on individual and team performance
              with a single click.
            </p>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how-it-works" className="howItWorks">
        <div className="howItWorksContainer">
          <div className="textCenter">
            <h2 className="howItWorksTitle">How It Works</h2>
            <p className="howItWorksSubtitle">
              Get started with bizzNest Flow in just a few simple steps
            </p>
          </div>

          <div className="stepsContainer">
            {/* Step 1 */}
            <div className="stepCard">
              <div className="stepNumber stepGreen">1</div>
              <h3>Input Data</h3>
              <p>
                Add your interns' profiles and project requirements to the
                platform.
              </p>
            </div>
            <div className="stepArrow">➡</div>

            {/* Step 2 */}
            <div className="stepCard">
              <div className="stepNumber stepPink">2</div>
              <h3>Algorithm Matches</h3>
              <p>
                Our algorithm analyzes the data and creates optimal intern-project
                pairings.
              </p>
            </div>
            <div className="stepArrow">➡</div>

            {/* Step 3 */}
            <div className="stepCard">
              <div className="stepNumber stepGreen">3</div>
              <h3>Track & Optimize</h3>
              <p>
                Monitor progress, gather insights, and continuously improve your
                talent development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="footer">
        <p className="footerRights">
          © 2025 bizzNest Flow. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
