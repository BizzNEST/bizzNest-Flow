import React from 'react';
import './ConfirmPopup.css';
import Check from "../../assets/check.svg";
import Close from "../../assets/close.svg";

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h3>{message}</h3>
                <div className="popup-buttons">
                    <button className="confirm-btn" onClick={onConfirm}>
                        <img src={Check} alt="Confirm" className="popup-icon" />
                    </button>
                    <button className="cancel-btn" onClick={onCancel}>
                        <img src={Close} alt="Cancel" className="popup-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;