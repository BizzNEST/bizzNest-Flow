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

const InternGrowthPage = () => {
    const { internID } = useParams();
    const navigate = useNavigate();

    const [intern, setIntern] = useState(null);

    useEffect(() => {
        const fetchInternData = async () => {
            try {
                const response = await fetch(`http://localhost:3360/getIntern/${internID}`);
                const data = await response.json();

                console.log("Fetched Intern Data:", data);

                if (data) {
                    // ✅ Decode Base64 profilePic if necessary
                    let profilePic = profile; // Default
                    if (data.profilePic) {
                        const decodedPath = atob(data.profilePic); // Decode Base64
                        profilePic = `http://localhost:3360${decodedPath}`;
                    }

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
            <NavBar />
            <div className="intern-growth-page">
                <div className="header-container">
                    {/* Back Button */}
                    <button className="returnToProjects" onClick={() => navigate(`/editIntern/${internID}`)}>
                        <img className="returnArrow" src={returnArrow} alt="Return to Projects" />
                    </button>

                    {/* Intern Name */}
                    <h1 className="intern-growth-title">
                        {intern ? `${intern.firstName} ${intern.lastName}'s Growth` : "Intern Growth"}
                    </h1>

                    {/* ✅ Correctly Display Profile Picture */}
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

                <div className="growth-container">
                    {/* Top Row: Graphs Side by Side */}
                    <div className="graphs-container">
                        <SkillGrowthChart internID={internID} />
                        <MonthlyGrowthChart internID={internID} />
                    </div>

                    {/* Bottom Row: Skill Containers Side by Side */}
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