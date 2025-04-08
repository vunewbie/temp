import React, { useState } from 'react';
import { updateAreaInfoAPI } from '../../../api/establishments/AreaAPI';
import { districtIcon, cityIcon } from '../../../assets';
import './AreaPopupWindow.css';

const AreaPopupWindow = ({ areaInfo, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [areaData, setAreaData] = useState({
        district: areaInfo.district || '',
        city: areaInfo.city || '',
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const hasChanged = Object.keys(areaData).some(
                key => areaData[key] !== areaInfo[key]
            );

            if (!hasChanged) {
                setSuccess('Không có thông tin nào được thay đổi.');
                setIsLoading(false);
                setIsEditing(false);
                return;
            }
            
            await updateAreaInfoAPI(areaInfo.id, areaData);
            
            setSuccess('Thông tin đã được cập nhật thành công.');
            setIsEditing(false);
            
            setTimeout(() => {
                onClose();
            }, 1000);
            
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin khu vực:', err);
            
            if (err.response && err.response.data) {
                const firstErrorField = Object.keys(err.response.data)[0];
                const firstError = err.response.data[firstErrorField][0];
                setError(firstError);
            } else {
                setError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading && !areaData.district && !areaData.city) {
        return (
            <div className="area-popup-container">
                <div className="area-popup-window">
                    <h2>Thông tin khu vực</h2>
                    <div className="area-popup-loading">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="area-popup-container">
            <div className="area-popup-window">
                <button 
                    className="area-popup-close-button"
                    onClick={onClose}
                    title="Đóng"
                >
                    &times;
                </button>
                <h2>Thông tin khu vực</h2>
                
                {error && <div className="area-popup-error-message">{error}</div>}
                {success && <div className="area-popup-success-message">{success}</div>}
                
                <div className="area-popup-form-header">
                    <div className="area-popup-user-actions">
                        {!isEditing ? (
                            <button 
                                type="button" 
                                className="area-popup-edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa thông tin
                            </button>
                        ) : (
                            <div className="area-popup-edit-actions">
                                <button 
                                    type="button" 
                                    className="area-popup-cancel-button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setAreaData({
                                            district: areaInfo.district || '',
                                            city: areaInfo.city || '',
                                        });
                                    }}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="button" 
                                    className="area-popup-save-button"
                                    disabled={isLoading}
                                    onClick={handleSubmit}
                                >
                                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <form className="area-popup-form">
                    <div className="area-popup-form-row">
                        <div className="area-popup-form-group">
                            <label>
                                <span className="area-popup-form-icon-wrapper">
                                    <img src={districtIcon} alt="Quận" className="area-popup-form-field-icon" />
                                    Quận:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={areaData.district}
                                onChange={(e) => setAreaData({ ...areaData, district: e.target.value })}
                                disabled={!isEditing}
                                className="area-popup-form-input"
                            />
                        </div>
                        <div className="area-popup-form-group">
                            <label>
                                <span className="area-popup-form-icon-wrapper">
                                    <img src={cityIcon} alt="Thành phố" className="area-popup-form-field-icon" />
                                    Thành phố:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={areaData.city}
                                onChange={(e) => setAreaData({ ...areaData, city: e.target.value })}
                                disabled={!isEditing}
                                className="area-popup-form-input"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AreaPopupWindow;
