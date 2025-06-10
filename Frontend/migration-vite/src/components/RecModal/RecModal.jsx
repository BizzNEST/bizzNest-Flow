import React from 'react';
import styles from './RecModal.module.css';

const RecModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button
                  className={styles.closeBtn}
                  onClick={onClose}
                  >
                    &times;
                  </button>
                  {children}
            </div>
        </div>
    );
};

export default RecModal;