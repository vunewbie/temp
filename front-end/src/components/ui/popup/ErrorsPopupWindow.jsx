import React from 'react';
import './ErrorsPopupWindow.css';
import errorIcon from '../../../assets/icons/error-icon.svg';

const ErrorsPopupWindow = ({ errors, onClose }) => {
    if (!errors || errors.length === 0) return null;

    return (
        <div className="errors-popup-overlay" onClick={onClose}>
            <div className="errors-popup-container" onClick={e => e.stopPropagation()}>
                <div className="errors-popup-header">
                    <h3 className="errors-popup-title">Lỗi</h3>
                    <button className="errors-popup-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                
                <ul className="errors-list">
                    {errors.map((error, index) => (
                        <li key={index} className="error-item">
                            <img src={errorIcon} alt="Error" className="error-icon" />
                            <span className="error-message">{error}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ErrorsPopupWindow; 