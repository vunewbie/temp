import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { retrieveCustomerInfoAPI, updateCustomerInfoAPI } from '../../api/CustomerAPI';
import { translateErrorMessage } from '../../utils/errorTranslator';
import './UserInfo.css';

// Import icons
import usernameIcon from '../../assets/dashboard/username-icon.svg';
import emailIcon from '../../assets/dashboard/email-icon.svg';
import phoneNumberIcon from '../../assets/dashboard/phone-number-icon.svg';
import citizenIdIcon from '../../assets/dashboard/citizen-id-icon.svg';
import fullnameIcon from '../../assets/dashboard/fullname-icon.svg';
import genderIcon from '../../assets/dashboard/gender-icon.svg';
import dateOfBirthIcon from '../../assets/dashboard/date-of-birth-icon.svg';
import dateJoinedIcon from '../../assets/dashboard/date-joined-icon.svg';

// Customer-specific icons
import cumulativePointIcon from '../../assets/dashboard/customer/cumulative-point-icon.svg';
import tierIcon from '../../assets/dashboard/customer/tier-icon.svg';

// Manager-specific icons
import addressIcon from '../../assets/dashboard/manager/address-icon.svg';
import branchIcon from '../../assets/dashboard/manager/branch-icon.svg';
import yearsOfExperienceIcon from '../../assets/dashboard/manager/years-of-experience-icon.svg';
import salaryIcon from '../../assets/dashboard/manager/salary-icon.svg';

// Employee-specific icons
import departmentIcon from '../../assets/dashboard/employee/department-icon.svg';

const UserInfo = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone_number: '',
    citizen_id: '',
    full_name: '',
    gender: 'M',
    date_of_birth: '',
    avatar: null,
    joinDate: '',
    address: '',
    branch: '',
    year_of_experience: '',
    salary: ''
  });
  const [customerData, setCustomerData] = useState({
    cumulative_points: 0,
    total_points: 0,
    tier: 'B',
    last_tier_update: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialUserData, setInitialUserData] = useState({
    username: '',
    email: '',
    phone_number: '',
    citizen_id: '',
    full_name: '',
    gender: 'M',
    date_of_birth: '',
    avatar: null,
    joinDate: '',
    address: '',
    branch: '',
    year_of_experience: '',
    salary: ''
  });
  const [branches, setBranches] = useState([]);

  // Format phone number for display
  const formatPhoneNumberForDisplay = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // If phone number starts with 84, convert to domestic format
    if (cleanedNumber.startsWith('84')) {
      return '0' + cleanedNumber.substring(2);
    }
    
    // If phone number starts with 0, keep it
    if (cleanedNumber.startsWith('0')) {
      return cleanedNumber;
    }
    
    // If phone number doesn't start with 0, add 0 in front
    return '0' + cleanedNumber;
  };
  
  // Format phone number for API
  const formatPhoneNumberForAPI = (phoneNumber) => {
    if (!phoneNumber) return null;
    
    // Remove all non-numeric characters
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // If phone number starts with 0, replace with +84
    if (cleanedNumber.startsWith('0')) {
      return '+84' + cleanedNumber.substring(1);
    }
    
    // If phone number doesn't start with 84, add +84
    if (!cleanedNumber.startsWith('84')) {
      return '+84' + cleanedNumber;
    }
    
    // If phone number already has country code 84, add +
    return '+' + cleanedNumber;
  };

  // Convert tier code to display name
  const getTierDisplayName = (tierCode) => {
    switch (tierCode) {
      case 'B': return 'Đồng';
      case 'S': return 'Bạc';
      case 'G': return 'Vàng';
      default: return tierCode;
    }
  };

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) {
        setIsLoading(true);
        setError('');
        
        try {
          if (user.type === 'C') {
            // If customer, call API to get customer info
            const data = await retrieveCustomerInfoAPI(user.id);
            
            if (data) {
              // Update user info
              const userInfo = data.user || {};
              const newUserData = {
                username: userInfo.username || '',
                email: userInfo.email || '',
                phone_number: formatPhoneNumberForDisplay(userInfo.phone_number) || '',
                citizen_id: userInfo.citizen_id || '',
                full_name: userInfo.full_name || '',
                gender: userInfo.gender || 'M',
                date_of_birth: userInfo.date_of_birth ? 
                  new Date(userInfo.date_of_birth).toISOString().split('T')[0] : '',
                avatar: userInfo.avatar || null,
                joinDate: userInfo.date_joined ? 
                  new Date(userInfo.date_joined).toISOString().split('T')[0] : '',
                address: userInfo.address || '',
                branch: userInfo.branch || '',
                year_of_experience: userInfo.year_of_experience || '',
                salary: userInfo.salary || ''
              };
              
              setUserData(newUserData);
              // Save initial data for comparison when updating
              setInitialUserData(newUserData);
              
              // Update customer info
              setCustomerData({
                cumulative_points: data.cumulative_points || 0,
                total_points: data.total_points || 0,
                tier: data.tier || 'B',
                last_tier_update: data.last_tier_update ? 
                  new Date(data.last_tier_update).toISOString().split('T')[0] : ''
              });
              
              // Update avatar preview if available
              if (userInfo.avatar) {
                setAvatarPreview(userInfo.avatar);
              }
            }
          } else {
            // Currently only supports customer info
            console.warn('UserInfo currently only supports customer info');
          }
        } catch (err) {
          console.error('Lỗi khi lấy thông tin người dùng:', err);
          setError('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prev => ({ ...prev, avatar: file }));
      
      // Create preview for avatar
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (user && user.id && user.type === 'C') {
        // If new avatar, handle avatar upload first
        if (userData.avatar instanceof File) {
          const formData = new FormData();
          formData.append('user.avatar', userData.avatar);
          
          try {
            // Upload avatar
            await updateCustomerInfoAPI(user.id, formData);
            console.log('Upload avatar thành công');
          } catch (error) {
            console.error('Lỗi khi upload avatar:', error);
            setError('Không thể upload ảnh đại diện. Vui lòng thử lại.');
            setIsLoading(false);
            return;
          }
        }

        // Prepare data to update other info
        const dataToUpdate = { user: {} };
        
        // Process phone number according to international format
        if (userData.phone_number !== initialUserData.phone_number) {
          const formattedPhoneNumber = formatPhoneNumberForAPI(userData.phone_number);
          console.log('Số điện thoại sau khi format:', formattedPhoneNumber);
          dataToUpdate.user.phone_number = formattedPhoneNumber;
        }
        
        if (userData.citizen_id !== initialUserData.citizen_id) {
          dataToUpdate.user.citizen_id = userData.citizen_id.trim() !== '' ? 
            userData.citizen_id : null;
        }
        
        if (userData.full_name !== initialUserData.full_name) {
          dataToUpdate.user.full_name = userData.full_name.trim() !== '' ? 
            userData.full_name : null;
        }
        
        if (userData.gender !== initialUserData.gender) {
          dataToUpdate.user.gender = userData.gender || null;
        }
        
        if (userData.date_of_birth !== initialUserData.date_of_birth) {
          dataToUpdate.user.date_of_birth = userData.date_of_birth || null;
        }
        
        // Only update email if changed
        if (userData.email !== initialUserData.email) {
          dataToUpdate.user.email = userData.email || null;
        }

        // Check if there is any data to update (excluding avatar)
        if (Object.keys(dataToUpdate.user).length > 0) {
          // Call API to update info
          await updateCustomerInfoAPI(user.id, dataToUpdate);
        }

        setSuccess('Cập nhật thông tin thành công!');
        setIsEditing(false);
        
        // Update initial data
        setInitialUserData(userData);
      } else if (user && user.type === 'E') {
        // If employee, call API to update employee info
        const dataToUpdate = { user: {} };
        
        // Process phone number according to international format
        if (userData.phone_number !== initialUserData.phone_number) {
          const formattedPhoneNumber = formatPhoneNumberForAPI(userData.phone_number);
          console.log('Số điện thoại sau khi format:', formattedPhoneNumber);
          dataToUpdate.user.phone_number = formattedPhoneNumber;
        }
        
        if (userData.citizen_id !== initialUserData.citizen_id) {
          dataToUpdate.user.citizen_id = userData.citizen_id.trim() !== '' ? 
            userData.citizen_id : null;
        }
        
        if (userData.full_name !== initialUserData.full_name) {
          dataToUpdate.user.full_name = userData.full_name.trim() !== '' ? 
            userData.full_name : null;
        }
        
        if (userData.gender !== initialUserData.gender) {
          dataToUpdate.user.gender = userData.gender || null;
        }
        
        if (userData.date_of_birth !== initialUserData.date_of_birth) {
          dataToUpdate.user.date_of_birth = userData.date_of_birth || null;
        }
        
        // Only update email if changed
        if (userData.email !== initialUserData.email) {
          dataToUpdate.user.email = userData.email || null;
        }

        // Check if there is any data to update (excluding avatar)
        if (Object.keys(dataToUpdate.user).length > 0) {
          // Call API to update info
          await updateCustomerInfoAPI(user.id, dataToUpdate);
        }

        setSuccess('Cập nhật thông tin thành công!');
        setIsEditing(false);
        
        // Update initial data
        setInitialUserData(userData);
      } else {
        // Currently only supports customer and employee info
        console.warn('UserInfo currently only supports customer and employee info');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin.';
        
        if (errorData.user) {
          const errors = Object.entries(errorData.user)
            .map(([field, messages]) => {
              const translatedMessages = messages.map(msg => translateErrorMessage(msg));
              return `${field}: ${translatedMessages.join(', ')}`;
            });
          errorMessage = errors.join('\n');
        }
        
        setError(errorMessage);
      } else {
        setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Display different fields based on user type
  const renderUserTypeSpecificFields = () => {
    if (!user) return null;

    switch (user.type) {
      case 'C': // Customer
        return (
          <div className="form-row">
            <div className="form-group">
              <label>
                <span className="form-icon-wrapper">
                  <img src={cumulativePointIcon} alt="Điểm tích lũy" className="form-field-icon" />
                  Điểm tích lũy:
                </span>
              </label>
              <input 
                type="text" 
                value={customerData.cumulative_points || 0} 
                disabled 
              />
            </div>
            <div className="form-group">
              <label>
                <span className="form-icon-wrapper">
                  <img src={tierIcon} alt="Hạng thành viên" className="form-field-icon" />
                  Hạng thành viên:
                </span>
              </label>
              <input 
                type="text" 
                value={customerData.tier === 'B' ? 'Đồng' : 
                       customerData.tier === 'S' ? 'Bạc' : 
                       customerData.tier === 'G' ? 'Vàng' : ''} 
                disabled 
              />
            </div>
          </div>
        );
      case 'E': // Employee
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <span className="form-icon-wrapper">
                    <img src={branchIcon} alt="Chi nhánh" className="form-field-icon" />
                    Chi nhánh:
                  </span>
                </label>
                <input type="text" value="Chi nhánh Hà Nội" disabled />
              </div>
              <div className="form-group">
                <label>
                  <span className="form-icon-wrapper">
                    <img src={departmentIcon} alt="Phòng ban" className="form-field-icon" />
                    Phòng ban:
                  </span>
                </label>
                <input type="text" value="Nhân viên phục vụ" disabled />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full-width">
                <label>
                  <span className="form-icon-wrapper">
                    <img src={addressIcon} alt="Địa chỉ" className="form-field-icon" />
                    Địa chỉ:
                  </span>
                </label>
                <input 
                  type="text" 
                  name="address" 
                  value={userData.address || ''} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
          </>
        );
      case 'M': // Manager
        return (
          <>
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
                  name="address"
                  value={userData.address || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <div className="form-group">
                <label>
                  <span className="form-icon-wrapper">
                    <img src={branchIcon} alt="Chi nhánh" className="form-field-icon" />
                    Chi nhánh:
                  </span>
                </label>
                <input
                  type="text"
                  value={branches.find(b => b.id === userData.branch)?.name || 'Chưa có chi nhánh'}
                  disabled
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  <span className="form-icon-wrapper">
                    <img src={yearsOfExperienceIcon} alt="Năm kinh nghiệm" className="form-field-icon" />
                    Năm kinh nghiệm:
                  </span>
                </label>
                <input
                  type="number"
                  name="year_of_experience"
                  value={userData.year_of_experience || 0}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="0"
                  placeholder="Nhập số năm kinh nghiệm"
                />
              </div>
              <div className="form-group">
                <label>
                  <span className="form-icon-wrapper">
                    <img src={salaryIcon} alt="Lương" className="form-field-icon" />
                    Lương:
                  </span>
                </label>
                <input
                  type="text"
                  value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(userData.salary || 0)}
                  disabled
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-info-container">
      <h2>Thông tin tài khoản</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="avatar-section">
            <div className="avatar-container">
              <img 
                src={avatarPreview || userData.avatar || 'https://via.placeholder.com/150'} 
                alt="Ảnh đại diện" 
                className="avatar-preview"
              />
              {isEditing && (
                <label htmlFor="avatar-input" className="avatar-upload-label">
                  Thay đổi
                  <input
                    type="file"
                    id="avatar-input"
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="avatar-input"
                  />
                </label>
              )}
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
                  onClick={() => setIsEditing(false)}
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
        
        <div className="form-row">
          <div className="form-group">
            <label>
              <span className="form-icon-wrapper">
                <img src={usernameIcon} alt="Tên đăng nhập" className="form-field-icon" />
                Tên đăng nhập:
              </span>
            </label>
            <input 
              type="text" 
              value={userData.username} 
              disabled 
            />
          </div>
          <div className="form-group">
            <label>
              <span className="form-icon-wrapper">
                <img src={emailIcon} alt="Email" className="form-field-icon" />
                Email:
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              <span className="form-icon-wrapper">
                <img src={phoneNumberIcon} alt="Số điện thoại" className="form-field-icon" />
                Số điện thoại:
              </span>
            </label>
            <input
              type="tel"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleChange}
              disabled={!isEditing}
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
              name="citizen_id"
              value={userData.citizen_id}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        
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
              name="full_name"
              value={userData.full_name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>
              <span className="form-icon-wrapper">
                <img src={genderIcon} alt="Giới tính" className="form-field-icon" />
                Giới tính:
              </span>
            </label>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="M">Nam</option>
              <option value="F">Nữ</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              <span className="form-icon-wrapper">
                <img src={dateOfBirthIcon} alt="Ngày sinh" className="form-field-icon" />
                Ngày sinh:
              </span>
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={userData.date_of_birth}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
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
        </div>
        
        {renderUserTypeSpecificFields()}
      </form>
    </div>
  );
};

export default UserInfo; 