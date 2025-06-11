import React from "react";
import styles from "./ConfirmPopup.module.css";
import Check from "../../assets/check.svg";
import Close from "../../assets/close.svg";

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.popUpOverlay}>
      <div className={styles.popUpBox}>
        <h3>{message}</h3>
        <div className={styles.popUpButtons}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            <img src={Check} alt="Confirm" className={styles.popUpIcon} />
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            <img src={Close} alt="Cancel" className={styles.popUpIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
