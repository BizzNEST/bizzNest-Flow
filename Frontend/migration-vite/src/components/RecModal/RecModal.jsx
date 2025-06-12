import React from "react";
import styles from "./RecModal.module.css";

const RecModal = ({
  isOpen,
  onClose,
  intern,
  isIntern,
  isLeader,
  isAscending,
  isLoading,
  onAssignIntern,
  onMakeLeader,
}) => {
  if (!isOpen || !intern) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.modalTitle}>{intern.name}</h2>
        <p>
          {isAscending ? "Leadership Candidate" : "Learning Opportunity"}
        </p>
        <p>
          {isAscending
            ? intern.eligible
              ? "Eligible for leadership"
              : "Not eligible"
            : `Potential Growth: ${intern.percent.toFixed(1)}%`}
        </p>

        <div className={styles.modalButtons}>
          {!isLeader && (
            <button
              className={`${styles.assignBtn} ${isIntern ? styles.active : ""}`}
              onClick={onAssignIntern}
              disabled={isLoading}
            >
              {isIntern ? "Intern ✔" : "Assign Intern"}
            </button>
          )}
          {intern.eligible && !isIntern && (
            <button
              className={`${styles.leaderBtn} ${isLeader ? styles.active : ""}`}
              onClick={onMakeLeader}
              disabled={isLoading}
            >
              {isLeader ? "Leader ⭐" : "Make Leader"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecModal;