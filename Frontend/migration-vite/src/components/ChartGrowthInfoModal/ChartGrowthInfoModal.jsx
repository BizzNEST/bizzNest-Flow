// src/components/ChartGrowthInfoModal/ChartGrowthInfoModal.jsx
import React from "react";
import graphLogo from "../../assets/growth.svg";
import styles from "./ChartGrowthInfoModal.module.css";

const GrowthChartInfoModal = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.growthChartInfoCloseBttn} onClick={onClose}>
          X
        </button>
        <h2 style={{ color: "#2dd4bf" }}>
          <img src={graphLogo} />
          Understanding Growth Charts
        </h2>
        <h3>Monthly Growth Over Time</h3>
        <p>
          This line chart shows the intern's growth progression month by month
          since they started.
        </p>
        <li>
          <span className={styles.boldSpan}>X-axis:</span> Represents months
          from when the intern started to the present
        </li>
        <li>
          <span className={styles.boldSpan}>Y-axis:</span> Shows growth
          percentage for each month
        </li>
        <li>
          <span className={styles.boldSpan}>Line slope:</span> Steeper slopes
          indicate faster learning periods
        </li>
        <li>
          <span className={styles.boldSpan}>Plateaus:</span> Flat sections may
          indicate periods where the intern was focusing on consolidating skills
        </li>
        <p>
          The overall trend of this chart helps identify if the intern is
          consistently improving or if there are specific periods of accelerated
          growth.
        </p>
        <div style={{ border: "1px solid gray" }}></div>
        <h2 style={{ color: "#f472b5" }}>Skill Growth</h2>
        <h3>
          This bar chart shows the percentage growth in each skill area since
          the intern started.
        </h3>
        <li>
          <span className={styles.boldSpan}>X-axis:</span> Different skill
          categories (Frontend, Backend, WordPress)
        </li>
        <li>
          <span className={styles.boldSpan}>Y-axis:</span> Percentage growth in
          each skill area
        </li>
        <li>
          <span className={styles.boldSpan}>Bar height:</span> Taller bars
          indicate greater improvement in that skill
        </li>
        <p>
          This chart helps identify which skills the intern is developing most
          rapidly and where they might need additional support.
        </p>
        <div style={{ border: "1px solid gray" }}></div>
        <h2 style={{ color: "#06a5fa" }}>Initial vs Current Skills</h2>
        <h3>
          These panels compare the intern's skill levels when they started
          versus their current proficiency.
        </h3>
        <li>
          <span className={styles.boldSpan}>Initial Skills:</span> Baseline
          skill levels when the intern joined
        </li>
        <li>
          <span className={styles.boldSpan}>Current Skills:</span> Present skill
          levels after training and experience
        </li>
        <li>
          <span className={styles.boldSpan}>Scale:</span> Skills are rated on a
          scale of 0-10, where:
          <ul>0-3: Beginner level</ul>
          <ul>4-6: Intermediate level</ul>
          <ul>7-10: Advanced level</ul>
        </li>
        <p>
          Comparing these panels helps visualize the intern's journey and
          quantify their improvement in specific skill areas.
        </p>
        <div className={styles.howWeCalculateGrowth}>
          <h2 style={{ color: "#c084fc" }}>How We Calculate Growth</h2>
          <h3>Growth percentages are calculated using multiple data points:</h3>
          <li>Skill Assessments: Regular technical evaluations by mentors</li>
          <li>
            Project Contributions: Quality and quantity of work on assigned
            projects
          </li>
          <li>Learning Velocity: How quickly new concepts are mastered</li>
          <li>Peer Feedback: Input from team members and collaborators</li>
          <p>
            Growth scores are updated monthly and provide an objective measure
            of progress over time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrowthChartInfoModal;
