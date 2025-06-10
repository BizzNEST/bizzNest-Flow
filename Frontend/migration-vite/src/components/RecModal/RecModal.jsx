import React from 'react';

const RecModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full">
                <button
                  className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl"
                  onClick={onClose}
                  >
                    &times; // This is displayed as a "×" icon
                  </button>
                  {children}
            </div>
        </div>
    );
};

export default RecModal;