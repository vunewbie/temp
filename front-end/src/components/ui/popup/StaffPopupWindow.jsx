import React, { useState, useEffect } from 'react';
import { updateEmployeeInfoAPI } from '../../../api/accounts/EmployeeAPI';
import { listDepartmentInfoAPI } from '../../../api/establishments/DepartmentAPI';
import { 
    emailIcon, phoneNumberIcon, citizenIdIcon, fullnameIcon,
    genderIcon, dateOfBirthIcon, dateJoinedIcon, addressIcon, departmentIcon
} from '../../../assets';
import { defaultAvatar } from '../../../assets';
import '../../dashboard/UserInfo.css';
import './StaffPopupWindow.css';

const StaffPopupWindow = ({ employeeInfo, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [departments, setDepartments] = useState([]);
    
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
    
    // employee data
    const [employeeData, setEmployeeData] = useState({
        address: '',
        departmentId: null,
        departmentName: '',
    });
    
    // avatar preview
    const [avatarPreview, setAvatarPreview] = useState('');
    
    // Khởi tạo dữ liệu từ props khi component được tải
    useEffect(() => {
        const initializeData = async () => {
            try {
                setIsLoading(true);
                
                // Lấy thông tin từ employeeInfo prop
                const userInfo = employeeInfo.user || {};
                
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
                
                // Cập nhật thông tin employee
                setEmployeeData({
                    address: employeeInfo.address || '',
                    departmentId: employeeInfo.department || null,
                    departmentName: employeeInfo.department_name || 'Chưa có bộ phận',
                });
                
                // Cập nhật avatar preview
                if (userInfo.avatar) {
                    setAvatarPreview(userInfo.avatar);
                }
                
                // Lấy danh sách các bộ phận
                const departmentsData = await listDepartmentInfoAPI();
                setDepartments(departmentsData);
                
            } catch (err) {
                console.error('Lỗi khi khởi tạo thông tin nhân viên:', err);
                setError('Không thể khởi tạo thông tin nhân viên. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeData();
    }, [employeeInfo]);
    
    // Xử lý khi thay đổi bộ phận
    const handleDepartmentChange = (e) => {
        const departmentId = parseInt(e.target.value);
        const department = departments.find(d => d.id === departmentId);
        
        setEmployeeData({
            ...employeeData,
            departmentId: departmentId,
            departmentName: department ? department.name : 'Chưa có bộ phận'
        });
    };
    
    // Xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // Nếu không có thay đổi, hiển thị thông báo
            if (employeeData.departmentId === null) {
                setSuccess('Không có thông tin nào được thay đổi.');
                setIsLoading(false);
                setIsEditing(false);
                return;
            }
            
            // Cập nhật thông tin nhân viên
            const updateData = {
                department: employeeData.departmentId
            };
            
            await updateEmployeeInfoAPI(userData.id, updateData);
            
            setSuccess('Thông tin đã được cập nhật thành công.');
            setIsEditing(false);
            
            // Đóng popup sau 1 giây
            setTimeout(() => {
                onClose();
            }, 1000);
            
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin nhân viên:', err);
            
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
        // Ví dụ, nếu avatar là /media/avatars/image.jpg
        // Chúng ta cần thêm API base URL
        const baseUrl = import.meta.env.VITE_BACKEND_API.split('/api')[0];
        return `${baseUrl}${avatarPath}`;
    };
    
    // Hiển thị trạng thái loading
    if (isLoading && !userData.username) {
        return (
            <div className="user-info-container popup-container staff-popup-window">
                <h2>Thông tin nhân viên</h2>
                <div className="loading">Đang tải dữ liệu...</div>
            </div>
        );
    }
    
    return (
        <div className="user-info-container popup-container staff-popup-window">
            <h2>Thông tin nhân viên</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit}>
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
                                Chỉnh sửa bộ phận
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
                                    type="submit" 
                                    className="save-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
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
                
                {/* Hàng 3: Ngày tham gia, Địa chỉ, Bộ phận */}
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
                            value={employeeData.address}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <span className="form-icon-wrapper">
                                <img src={departmentIcon} alt="Bộ phận" className="form-field-icon" />
                                Bộ phận:
                            </span>
                        </label>
                        {isEditing ? (
                            <select
                                value={employeeData.departmentId || ''}
                                onChange={handleDepartmentChange}
                            >
                                <option value="">-- Chọn bộ phận --</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type="text" 
                                value={employeeData.departmentName} 
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
    );
};

export default StaffPopupWindow;
