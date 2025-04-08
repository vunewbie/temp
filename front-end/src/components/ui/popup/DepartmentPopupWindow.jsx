import React, { useState } from 'react';
import { updateDepartmentInfoAPI } from '../../../api/establishments/DepartmentAPI';
import { 
    departmentIcon, salaryIcon, managerManagementIcon
} from '../../../assets';
import './DepartmentPopupWindow.css';

const DepartmentPopupWindow = ({ departmentInfo, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [departmentData, setDepartmentData] = useState({
        name: departmentInfo?.name || '',
        salary: departmentInfo?.salary || 0,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // Kiểm tra xem có trường nào thay đổi không
            const hasChanged = 
                departmentData.name !== departmentInfo.name || 
                departmentData.salary !== departmentInfo.salary;

            if (!hasChanged) {
                setSuccess('Không có thông tin nào được thay đổi.');
                setIsLoading(false);
                setIsEditing(false);
                return;
            }

            // Prepare data for API
            const updateData = {};
            
            if (departmentData.name !== departmentInfo.name) {
                updateData.name = departmentData.name;
            }
            
            if (departmentData.salary !== departmentInfo.salary) {
                updateData.salary = parseInt(departmentData.salary, 10);
            }
            
            await updateDepartmentInfoAPI(departmentInfo.id, updateData);
            
            setSuccess('Thông tin bộ phận đã được cập nhật thành công.');
            setIsEditing(false);
            
            setTimeout(() => {
                onClose();
            }, 1500);
            
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin bộ phận:', err);
            
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

    // Format salary for display with commas
    const formatSalary = (value) => {
        return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value);
    };

    // Remove commas when updating salary
    const handleSalaryChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setDepartmentData({
            ...departmentData,
            salary: value
        });
    };
    
    return (
        <div className="department-popup-container">
            <div className="department-popup-window">
                <button 
                    className="department-popup-close-button"
                    onClick={onClose}
                    title="Đóng"
                >
                    &times;
                </button>
                <h2>Thông tin bộ phận</h2>
                
                {error && <div className="department-popup-error-message">{error}</div>}
                {success && <div className="department-popup-success-message">{success}</div>}
                
                <div className="department-popup-form-header">
                    <div className="department-popup-icon">
                        <img src={managerManagementIcon} alt="Department" />
                    </div>
                    <div className="department-popup-user-actions">
                        {!isEditing ? (
                            <button 
                                type="button" 
                                className="department-popup-edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa thông tin
                            </button>
                        ) : (
                            <div className="department-popup-edit-actions">
                                <button 
                                    type="button" 
                                    className="department-popup-cancel-button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Khôi phục dữ liệu ban đầu
                                        setDepartmentData({
                                            name: departmentInfo.name || '',
                                            salary: departmentInfo.salary || 0,
                                        });
                                    }}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="button" 
                                    className="department-popup-save-button"
                                    disabled={isLoading}
                                    onClick={handleSubmit}
                                >
                                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <form className="department-popup-form">
                    <div className="department-popup-form-row">
                        <div className="department-popup-form-group">
                            <label>
                                <span className="department-popup-form-icon-wrapper">
                                    <img src={departmentIcon} alt="Tên bộ phận" className="department-popup-form-field-icon" />
                                    Tên bộ phận:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={departmentData.name}
                                onChange={(e) => setDepartmentData({ ...departmentData, name: e.target.value })}
                                disabled={!isEditing}
                                className="department-popup-form-input"
                            />
                        </div>
                        <div className="department-popup-form-group">
                            <label>
                                <span className="department-popup-form-icon-wrapper">
                                    <img src={salaryIcon} alt="Lương" className="department-popup-form-field-icon" />
                                    Lương (VNĐ):
                                </span>
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formatSalary(departmentData.salary)}
                                    onChange={handleSalaryChange}
                                    className="department-popup-form-input"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={formatSalary(departmentData.salary) + ' đ'}
                                    disabled
                                    className="department-popup-form-input"
                                />
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentPopupWindow; 