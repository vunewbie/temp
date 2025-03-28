import React, { useState, useEffect } from 'react';
import { updateManagerInfoAPI, listBranchInfoAPI } from '../../../api';
import { 
    emailIcon, phoneNumberIcon, citizenIdIcon, fullnameIcon, defaultAvatar,
    genderIcon, dateOfBirthIcon, dateJoinedIcon, addressIcon, branchIcon, salaryIcon
} from '../../../assets';
import '../../dashboard/UserInfo.css';
import './ManagerPopupWindow.css';

const ManagerPopupWindow = ({ managerInfo, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [branches, setBranches] = useState([]);
    
    const [userData, setUserData] = useState({
        id: '',
        username: '',
        email: '',
        phoneNumber: '',
        citizenId: '',
        fullName: '',
        gender: 'M',
        dateOfBirth: '',
        avatar: null,
        joinDate: '',
    });
    
    const [managerData, setManagerData] = useState({
        address: '',
        branchId: null,
        branchName: '',
        salary: 0,
    });
    
    const [avatarPreview, setAvatarPreview] = useState('');
    
    useEffect(() => {
        const initializeData = async () => {
            try {
                setIsLoading(true);
                const userInfo = managerInfo.user || {};
                
                setUserData({
                    id: userInfo.id || '',
                    username: userInfo.username || '',
                    email: userInfo.email || '',
                    phoneNumber: userInfo.phone_number || '',
                    citizenId: userInfo.citizen_id || '',
                    fullName: userInfo.full_name || '',
                    gender: userInfo.gender || 'M',
                    dateOfBirth: userInfo.date_of_birth ? 
                        new Date(userInfo.date_of_birth).toISOString().split('T')[0] : '',
                    avatar: userInfo.avatar || null,
                    joinDate: userInfo.date_joined ? 
                        new Date(userInfo.date_joined).toISOString().split('T')[0] : '',
                });
                
                setManagerData({
                    address: managerInfo.address || '',
                    branchId: managerInfo.branch || null,
                    branchName: managerInfo.branch_name || 'Chưa có chi nhánh',
                    salary: managerInfo.salary || 0,
                });
                
                if (userInfo.avatar) {
                    setAvatarPreview(userInfo.avatar);
                }
                
                const branchesData = await listBranchInfoAPI();
                setBranches(branchesData);
                
            } catch (err) {
                console.error('Lỗi khi khởi tạo thông tin quản lý:', err);
                setError('Không thể khởi tạo thông tin quản lý. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeData();
    }, [managerInfo]);
    
    const handleBranchChange = (e) => {
        const branchId = parseInt(e.target.value);
        const branch = branches.find(b => b.id === branchId);
        
        setManagerData({
            ...managerData,
            branchId: branchId,
            branchName: branch ? branch.name : 'Chưa có chi nhánh'
        });
    };
    
    const handleSalaryChange = (e) => {
        const salary = parseInt(e.target.value);
        
        setManagerData({
            ...managerData,
            salary: isNaN(salary) ? 0 : salary
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            if (managerData.branchId === null && managerData.salary === 0) {
                setSuccess('Không có thông tin nào được thay đổi.');
                setIsLoading(false);
                setIsEditing(false);
                return;
            }
            
            const updateData = {};
            
            if (managerData.branchId !== null) {
                updateData.branch = managerData.branchId;
            }
            
            if (managerData.salary > 0) {
                updateData.salary = managerData.salary;
            }
            
            await updateManagerInfoAPI(userData.id, updateData);
            
            setSuccess('Thông tin đã được cập nhật thành công.');
            setIsEditing(false);
            
            setTimeout(() => {
                onClose();
            }, 1000);
            
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin quản lý:', err);
            
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
    
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return defaultAvatar;
        
        if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
            return avatarPath;
        }
        
        const baseUrl = import.meta.env.VITE_BACKEND_API.split('/api')[0];
        return `${baseUrl}${avatarPath}`;
    };
    
    if (isLoading && !userData.username) {
        return (
            <div className="manager-popup-container">
                <div className="user-info-container manager-popup-window">
                    <h2>Thông tin quản lý</h2>
                    <div className="loading">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="manager-popup-container">
            <div className="user-info-container manager-popup-window">
                <h2>Thông tin quản lý</h2>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <div className="form-header">
                    <div className="avatar-section">
                        <div className="avatar-container">
                            <img 
                                src={getAvatarUrl(userData.avatar)} 
                                alt="Ảnh đại diện" 
                                className="avatar-preview"
                            />
                        </div>
                    </div>
                    
                    <div className="user-actions">
                        {!isEditing ? (
                            <button 
                                type="button" 
                                className="edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa thông tin
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => {
                                        setIsEditing(false);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="button" 
                                    className="save-button"
                                    disabled={isLoading}
                                    onClick={handleSubmit}
                                >
                                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <form>
                    {/* Row 1: Email, Phone Number, Citizen ID */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={emailIcon} alt="Email" className="form-field-icon" />
                                    Email:
                                </span>
                            </label>
                            <input
                                type="email"
                                value={userData.email}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={phoneNumberIcon} alt="Số điện thoại" className="form-field-icon" />
                                    Số điện thoại:
                                </span>
                            </label>
                            <input
                                type="tel"
                                value={userData.phoneNumber}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={citizenIdIcon} alt="Căn cước công dân" className="form-field-icon" />
                                    Căn cước công dân:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={userData.citizenId}
                                disabled
                            />
                        </div>
                    </div>
                    
                    {/* Row 2: Full Name, Gender, Date of Birth */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={fullnameIcon} alt="Họ tên" className="form-field-icon" />
                                    Họ tên:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={userData.fullName}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={genderIcon} alt="Giới tính" className="form-field-icon" />
                                    Giới tính:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={userData.gender === 'M' ? 'Nam' : 'Nữ'}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={dateOfBirthIcon} alt="Ngày sinh" className="form-field-icon" />
                                    Ngày sinh:
                                </span>
                            </label>
                            <input
                                type="date"
                                value={userData.dateOfBirth}
                                disabled
                            />
                        </div>
                    </div>
                    
                    {/* Row 3: Join Date, Address, Branch */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={dateJoinedIcon} alt="Ngày tham gia" className="form-field-icon" />
                                    Ngày tham gia:
                                </span>
                            </label>
                            <input 
                                type="date" 
                                value={userData.joinDate} 
                                disabled 
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={salaryIcon} alt="Lương" className="form-field-icon" />
                                    Lương (VNĐ):
                                </span>
                            </label>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    value={managerData.salary} 
                                    onChange={handleSalaryChange}
                                    min="0"
                                    step="10000"
                                />
                            ) : (
                                <input 
                                    type="text" 
                                    value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(managerData.salary)} 
                                    disabled 
                                />
                            )}
                        </div>                        
                        <div className="form-group">
                            <label>
                                <span className="form-icon-wrapper">
                                    <img src={branchIcon} alt="Chi nhánh" className="form-field-icon" />
                                    Chi nhánh:
                                </span>
                            </label>
                            {isEditing ? (
                                <select
                                    value={managerData.branchId || ''}
                                    onChange={handleBranchChange}
                                >
                                    <option value="">-- Chọn chi nhánh --</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    type="text" 
                                    value={managerData.branchName} 
                                    disabled 
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* Row 4: Salary */}
                    <div className="form-row">
                        <div className="form-group">
                                <label>
                                    <span className="form-icon-wrapper">
                                        <img src={addressIcon} alt="Địa chỉ" className="form-field-icon" />
                                        Địa chỉ:
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={managerData.address}
                                    disabled
                                />
                        </div>
                    </div>
                </form>
                
                <div className="popup-actions">
                    <button 
                        type="button" 
                        className="close-popup-button"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagerPopupWindow;
