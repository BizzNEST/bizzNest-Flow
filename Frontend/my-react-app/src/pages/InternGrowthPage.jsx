import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SkillGrowthChart from "../components/SkillGrowthChart/SkillGrowthChart";
import MonthlyGrowthChart from "../components/MonthlyGrowthGraph/MonthlyGrowthGraph";
import InitialSkills from "../components/InitialSkills/InitialSkills";
import FinalSkills from "../components/FinalSkills/FinalSkills";
import "./InternGrowthPage.css";

const InternGrowthPage = () => {
    const { internID } = useParams();
    const [internName, setInternName] = useState("");

    useEffect(() => {
        const fetchInternName = async () => {
            try {
                const response = await fetch(`http://localhost:3360/getIntern/${internID}`);
                const data = await response.json();

                if (data) {
                    setInternName(`${data.firstName} ${data.lastName}`);
                } else {
                    console.error("Failed to fetch intern name");
                }
            } catch (error) {
                console.error("Error fetching intern details:", error);
            }
        };

        fetchInternName();
    }, [internID]);

    return (
        <div className="intern-growth-page">
            <h1 className="intern-growth-title">
                {internName ? `${internName}'s Growth` : "Intern Growth"}
            </h1>

            <div className="growth-container">
                {/* Top Row: Graphs Side by Side */}
                <div className="graphs-container">
                    <SkillGrowthChart internID={internID} />
                    <MonthlyGrowthChart internID={internID} />
                </div>

                {/* Bottom Row: Skill Containers Side by Side */}
                <div className="skills-container">
                    <InitialSkills internID={internID} />
                    <FinalSkills internID={internID} />
                </div>
            </div>
        </div>
    );
};

export default InternGrowthPage;