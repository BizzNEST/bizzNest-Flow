import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import Logo from "../assets/Logo.png";

const LandingPage = () => {
    const navigate = useNavigate();

  return (
    <div className="landingPageWrapper">
      <header className="landingHeader">
        <div className="logoLandingPageContainer">
          <img src={Logo} alt="Logo" />
          <p>bizzNest Flow</p>
        </div>
        <button onClick={() => navigate('/loginsignup')}>GET STARTED</button>
      </header>
      <div className="landingPageHero">
        <div className="learnMoreLandingPage">
          <h1>bizzNest Flow</h1>
          <p>
            bizzNest Flow is an intelligent growth optimizer that helps admins assign interns to projects based on their skill level and the project's difficulty. Using a data-driven approach, it ensures interns are placed in roles that maximize their learning while identifying ideal candidates for leadership opportunities.
          </p>
          <button>LEARN MORE</button>
        </div>
        <img src="/dataGraphic.svg" alt="graph" />
      </div>
    </div>
  );
};

export default LandingPage;
