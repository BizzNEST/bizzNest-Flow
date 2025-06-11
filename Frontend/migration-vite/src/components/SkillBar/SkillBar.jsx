import React from "react";
import styles from "./SkillBar.module.css";

const SkillBar = ({ label, value }) => {
  const percentage = Math.min((value / 10) * 100, 100);

  return (
    <div className={styles.skillBar}>
      <span className={styles.skillLabel}>{label}:</span>
      <div className={styles.barWrapper}>
        <div className={styles.barFill} style={{ width: `${percentage}%` }} />
      </div>
      <span className={styles.skillValue}>{value.toFixed(1)}</span>
    </div>
  );
};

export default SkillBar;
