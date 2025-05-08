import React from "react";
import MobileHome from "../../assets/mobileNavIcons/mobileHome.svg";
import MobileInterns from "../../assets/mobileNavIcons/mobileInterns.svg";
import MobileProjects from "../../assets/mobileNavIcons/mobileProjects.svg";
import ChatbotImage from "../../../src/assets/bot-message-square.svg";
import "./MobileNav.css";
import { Navigate, useNavigate } from "react-router";

const MobileNav = ({ onChatClick }) => {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <button onClick={() => navigate("/home")}>
        <img src={MobileHome} alt="Home" width={24} height={24} />
      </button>
      <button onClick={() => navigate("/interns")}>
        <img src={MobileInterns} alt="Interns" width={24} height={24} />
      </button>
      <button onClick={() => navigate("/CompletedProjects")}>
        <img src={MobileProjects} alt="Projects" width={24} height={24} />
      </button>
      <button onClick={onChatClick}>
        <img src={ChatbotImage} alt="Chat" />
      </button>
    </nav>
  );
};

export default MobileNav;
