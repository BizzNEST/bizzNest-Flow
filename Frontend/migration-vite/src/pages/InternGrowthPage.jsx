import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar/NavBar";
import SkillGrowthChart from "../components/SkillGrowthChart/SkillGrowthChart";
import MonthlyGrowthChart from "../components/MonthlyGrowthGraph/MonthlyGrowthGraph";
import InitialSkills from "../components/InitialSkills/InitialSkills";
import CurrentSkills from "../components/CurrentSkills/CurrentSkills";
import GrowthChartInfoModal from "../components/ChartGrowthInfoModal/ChartGrowthInfoModal";
import returnArrow from "../assets/returnArrow.svg";
import profile from "../assets/profile.svg";
import chartInfo from "../assets/chartsInfo.svg";
import styles from "./InternGrowthPage.module.css";

const InternGrowthPage = () => {
  const { internID } = useParams();
  const navigate = useNavigate();

  const [intern, setIntern] = useState(null);
  const [showModalInfo, setShowModalInfo] = useState(false);

  useEffect(() => {
    const fetchInternData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/getIntern/${internID}`
        );
        const data = await response.json();

        console.log("Fetched Intern Data:", data);

        if (data) {
          // ✅ Decode Base64 profilePic if necessary
          let profilePic = profile; // Default
          if (data.profilePic) {
            const decodedPath = atob(data.profilePic); // Decode Base64
            profilePic = `${import.meta.env.VITE_API_URL}${decodedPath}`;
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
    <div className={styles.bigContainer}>
      <NavBar />
      <div className={styles.newGrowthPageContainer}>
        <div className={styles.newGrowthPageWrapper}>
          <div className={styles.internGrowthPageInfo}>
            <button
              className={styles.returnToProjects}
              onClick={() => navigate(`/interns`)}
            >
              <img
                className="returnArrow"
                src={returnArrow}
                alt="Return to Projects"
              />
            </button>
            <h1 className={styles.internGrowthTitle}>
              {intern
                ? `${intern.firstName} ${intern.lastName}'s Growth`
                : "Intern Growth"}
              <span
                className={styles.growthChartInfo}
                onClick={() => setShowModalInfo(true)}
              >
                <img src={chartInfo} alt="Chart Info" />
              </span>
            </h1>

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
            <div className={styles.skillUpdates}>
              <InitialSkills internID={internID} />
              <CurrentSkills internID={internID} />
            </div>
          </div>
        </div>

        <div className={styles.graphsContainer}>
          <div className={styles.monthlyGrowthGraph}>
            <MonthlyGrowthChart internID={internID} />
          </div>
          <div className={styles.skillGrowthGraph}>
            <SkillGrowthChart internID={internID} />
          </div>
        </div>
      </div>

      {showModalInfo && (
        <GrowthChartInfoModal onClose={() => setShowModalInfo(false)} />
      )}
    </div>
  );
};

export default InternGrowthPage;
