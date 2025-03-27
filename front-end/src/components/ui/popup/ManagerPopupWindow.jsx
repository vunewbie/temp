import React, { useState, useEffect } from 'react';
import { updateManagerInfoAPI } from '../../../api/accounts/ManagerAPI';
import { listBranchInfoAPI } from '../../../api/establishments/BranchAPI';
import { 
    emailIcon, phoneNumberIcon, citizenIdIcon, fullnameIcon,
    genderIcon, dateOfBirthIcon, dateJoinedIcon, addressIcon, branchIcon, salaryIcon
} from '../../../assets';
import { defaultAvatar } from '../../../assets';
import '../../dashboard/UserInfo.css';
import './ManagerPopupWindow.css';

const ManagerPopupWindow = ({ managerInfo, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [branches, setBranches] = useState([]);
    
    // user data
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
    
    // manager data
    const [managerData, setManagerData] = useState({
        address: '',
        branchId: null,
        branchName: '',
        salary: 0,
    });
    
    // avatar preview
    const [avatarPreview, setAvatarPreview] = useState('');
    
    // Khởi tạo dữ liệu từ props khi component được tải
    useEffect(() => {
        const initializeData = async () => {
            try {
                setIsLoading(true);
                
                // Lấy thông tin từ managerInfo prop
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
                
                // Cập nhật thông tin manager
                setManagerData({
                    address: managerInfo.address || '',
                    branchId: managerInfo.branch || null,
                    branchName: managerInfo.branch_name || 'Chưa có chi nhánh',
                    salary: managerInfo.salary || 0,
                });
                
                // Cập nhật avatar preview
                if (userInfo.avatar) {
                    setAvatarPreview(userInfo.avatar);
                }
                
                // Lấy danh sách các chi nhánh
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
    
    // Xử lý khi thay đổi chi nhánh
    const handleBranchChange = (e) => {
        const branchId = parseInt(e.target.value);
        const branch = branches.find(b => b.id === branchId);
        
        setManagerData({
            ...managerData,
            branchId: branchId,
            branchName: branch ? branch.name : 'Chưa có chi nhánh'
        });
    };
    
    // Xử lý khi thay đổi lương
    const handleSalaryChange = (e) => {
        const salary = parseInt(e.target.value);
        
        setManagerData({
            ...managerData,
            salary: isNaN(salary) ? 0 : salary
        });
    };
    
    // Xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // Kiểm tra xem có thay đổi không
            if (managerData.branchId === null && managerData.salary === 0) {
                setSuccess('Không có thông tin nào được thay đổi.');
                setIsLoading(false);
                setIsEditing(false);
                return;
            }
            
            // Cập nhật thông tin quản lý
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
            
            // Đóng popup sau 1 giây
            setTimeout(() => {
                onClose();
            }, 1000);
            
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin quản lý:', err);
            
            if (err.response && err.response.data) {
                // Lấy lỗi đầu tiên từ response data
                const firstErrorField = Object.keys(err.response.data)[0];
                const firstError = err.response.data[firstErrorField][0];
                setError(firstError);
            } else {
                // Lỗi chung
                setError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // Hàm lấy URL hình ảnh đại diện
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return defaultAvatar;
        
        // Nếu avatar đã có http/https, giữ nguyên
        if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
            return avatarPath;
        }
        
        // Nếu avatar là đường dẫn tương đối, tạo URL đầy đủ
        const baseUrl = import.meta.env.VITE_BACKEND_API.split('/api')[0];
        return `${baseUrl}${avatarPath}`;
    };
    
    // Hiển thị trạng thái loading
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
                    {/* Hàng 1: Email, SĐT, CCCD */}
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
                    
                    {/* Hàng 2: Họ tên, Giới tính, Ngày sinh */}
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
                    
                    {/* Hàng 3: Ngày tham gia, Địa chỉ, Chi nhánh */}
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
                    
                    {/* Hàng 4: Lương */}
                    <div className="form-row">
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
