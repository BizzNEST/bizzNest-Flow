import ReactDOM from "react-dom";
import "./ChatbotModal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // clicking the overlay triggers onClose; clicking inside the box stops it
  return ReactDOM.createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
