import React from "react";
import "./SkillBar.css";

const SkillBar = ({ label, value }) => {
  const percentage = Math.min((value / 10) * 100, 100);

  return (
    <div className="skill-bar">
      <span className="skill-label">{label}:</span>
      <div className="bar-wrapper">
        <div className="bar-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="skill-value">{value.toFixed(1)}</span>
    </div>
  );
};

export default SkillBar;
