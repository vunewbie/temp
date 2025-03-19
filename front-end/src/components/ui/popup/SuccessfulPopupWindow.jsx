import React from 'react';
import './SuccessfulPopupWindow.css';

const SuccessfulPopupWindow = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="successful-popup-overlay" onClick={onClose}>
      <div className="successful-popup-container" onClick={e => e.stopPropagation()}>
        <div className="successful-popup-header">
          <h2 className="successful-popup-title">Thành Công</h2>
          <button className="successful-popup-close" onClick={onClose}>&times;</button>
        </div>
        <p className="successful-popup-message">{message}</p>
      </div>
    </div>
  );
};

export default SuccessfulPopupWindow; 