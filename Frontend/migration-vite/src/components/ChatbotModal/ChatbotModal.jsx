import ReactDOM from "react-dom";
import styles from "./ChatbotModal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // clicking the overlay triggers onClose; clicking inside the box stops it
  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
