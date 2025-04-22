import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from "../components/Navbar/NavBar";
import SkillGrowthChart from "../components/SkillGrowthChart/SkillGrowthChart";
import MonthlyGrowthChart from "../components/MonthlyGrowthGraph/MonthlyGrowthGraph";
import InitialSkills from "../components/InitialSkills/InitialSkills";
import CurrentSkills from "../components/CurrentSkills/CurrentSkills";
import returnArrow from '../assets/returnArrow.svg';
import profile from '../assets/profile.svg'; 
import "./InternGrowthPage.css";

/**
 * InternGrowthPage Component
 * Displays a detailed growth dashboard for an individual intern including:
 * - Skill growth chart
 * - Monthly growth chart
 * - Initial and current skill comparisons
 * - Profile image and header info
 */
const InternGrowthPage = () => {
  const { internID } = useParams();          // Grab intern ID from URL params
  const navigate = useNavigate();            // Navigation hook for back button
  const [intern, setIntern] = useState(null); // State to store intern info

  /**
   * Fetch intern data when component loads or internID changes
   */
  useEffect(() => {
    const fetchInternData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getIntern/${internID}`);
        const data = await response.json();

        console.log("Fetched Intern Data:", data);

        if (data) {
          // Default profile pic
          let profilePic = profile;

          // If Base64-encoded path exists, decode and construct full URL
          if (data.profilePic) {
            const decodedPath = atob(data.profilePic);
            profilePic = `${process.env.REACT_APP_API_URL}${decodedPath}`;
          }

          // Store the intern data with resolved profile image
          setIntern({ ...data, profilePic });
        } else {
          console.error("Failed to fetch intern data");
        }
      } catch (error) {
        console.error("Error fetching intern details:", error);
      }
    };

    fetchInternData();
  }, [internID]);

  return (
    <div className="big-container">
      {/* Top Navigation */}
      <NavBar />

      <div className="intern-growth-page">
        {/* Header section with intern info and controls */}
        <div className="header-container">
          {/* Return to edit intern page */}
          <button className="returnToProjects" onClick={() => navigate(`/editIntern/${internID}`)}>
            <img className="returnArrow" src={returnArrow} alt="Return to Projects" />
          </button>

          {/* Title with intern name */}
          <h1 className="intern-growth-title">
            {intern ? `${intern.firstName} ${intern.lastName}'s Growth` : "Intern Growth"}
          </h1>

          {/* Profile picture (fallback to default if image fails to load) */}
          {intern && (
            <img 
              src={intern.profilePic}
              alt="Profile"
              className="profile-pic"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profile;
              }}
            />
          )}
        </div>

        {/* Main content: Graphs and Skills */}
        <div className="growth-container">
          {/* Top row: growth graphs side by side */}
          <div className="graphs-container">
            <SkillGrowthChart internID={internID} />
            <MonthlyGrowthChart internID={internID} />
          </div>

          {/* Bottom row: initial vs current skill comparison */}
          <div className="skills-container">
            <InitialSkills internID={internID} />
            <CurrentSkills internID={internID} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternGrowthPage;
