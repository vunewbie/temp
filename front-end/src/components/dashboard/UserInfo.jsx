// libraries
import React, { useState, useEffect, useCallback } from 'react';
// context
import { useAuth } from '../../context/AuthContext';
// api
import { 
  retrieveCustomerInfoAPI, updateCustomerInfoAPI,
  retrieveAdminInfoAPI, updateAdminInfoAPI,
  retrieveManagerInfoAPI, updateManagerInfoAPI,
  retrieveEmployeeInfoAPI, updateEmployeeInfoAPI
} from '../../api';
// utils
import { formatPhoneNumberForDisplay, formatPhoneNumberForAPI } from '../../utils';
// styles
import './UserInfo.css';
// all icons from assets
import { 
  usernameIcon, emailIcon, phoneNumberIcon, citizenIdIcon, fullnameIcon,
  genderIcon, dateOfBirthIcon, dateJoinedIcon, cumulativePointIcon,
  tierIcon, addressIcon, branchIcon, yearsOfExperienceIcon, salaryIcon,
  departmentIcon
} from '../../assets';

const UserInfo = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  // user data
  const [userData, setUserData] = useState({
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
  // customer data
  const [customerData, setCustomerData] = useState({
    cumulativePoints: 0,
    totalPoints: 0,
    tier: 'B',
    lastTierUpdate: '',
  });
  // manager data
  const [managerData, setManagerData] = useState({
    address: '',
    yearsOfExperience: 0,
    salary: 0,
    branchName: ''
  });
  // employee data
  const [employeeData, setEmployeeData] = useState({
    address: '',
    departmentName: '',
    branchName: '',
    salary: 100000 // default value
  });
  // avatar preview
  const [avatarPreview, setAvatarPreview] = useState('');
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  // error state
  const [error, setError] = useState('');
  // success state
  const [success, setSuccess] = useState('');
  const [initialUserData, setInitialUserData] = useState({
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
  const [initialManagerData, setInitialManagerData] = useState({
    address: '',
    yearsOfExperience: 0,
    salary: 0,
    branchName: ''
  });
  // employee data
  const [initialEmployeeData, setInitialEmployeeData] = useState({
    address: '',
    departmentName: '',
    branchName: '',
    salary: 0
  });
  const [dataFetched, setDataFetched] = useState(false);

  // convert tier code to display name
  const getTierDisplayName = (tierCode) => {
    switch (tierCode) {
      case 'B': return 'Đồng';
      case 'S': return 'Bạc';
      case 'G': return 'Vàng';
      default: return tierCode;
    }
  };

  // fetch user data from api - convert to useCallback to avoid recreating function
  const fetchUserData = useCallback(async () => {
    if (!user || !user.id || dataFetched) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      let data = null;
      
      // different api call based on user type
      if (user.type === 'C') {
        data = await retrieveCustomerInfoAPI(user.id);
      } else if (user.type === 'A') {
        data = await retrieveAdminInfoAPI(user.id);
      } else if (user.type === 'M') {
        data = await retrieveManagerInfoAPI(user.id);
      } else if (user.type === 'E') {
        data = await retrieveEmployeeInfoAPI(user.id);
      } else {
        console.warn('UserInfo không hỗ trợ loại người dùng này');
        setIsLoading(false);
        return;
      }
      
      if (!data) {
        console.error('Không nhận được dữ liệu từ API');
        setIsLoading(false);
        return;
      }
      
      // get user info from data
      const userInfo = data.user || {};
      
      const newUserData = {
        username: userInfo.username || '',
        email: userInfo.email || '',
        phoneNumber: formatPhoneNumberForDisplay(userInfo.phone_number) || '',
        citizenId: userInfo.citizen_id || '',
        fullName: userInfo.full_name || '',
        gender: userInfo.gender || 'M',
        dateOfBirth: userInfo.date_of_birth ? 
          new Date(userInfo.date_of_birth).toISOString().split('T')[0] : '',
        avatar: userInfo.avatar || null,
        joinDate: userInfo.date_joined ? 
          new Date(userInfo.date_joined).toISOString().split('T')[0] : '',
      };
      
      // add additional fields based on user type
      if (user.type === 'M') {
        // update manager-specific data
        const newManagerData = {
          address: data.address || '',
          yearsOfExperience: data.years_of_experience || 0,
          salary: data.salary || 0,
          branchName: data.branch_name || 'Chưa có chi nhánh'
        };
        setManagerData(newManagerData);
        setInitialManagerData(newManagerData);
      } else if (user.type === 'E') {
        // update employee-specific data
        const newEmployeeData = {
          address: data.address || '',
          departmentName: data.department_name || 'Chưa có bộ phận',
          branchName: data.branch_name || 'Chưa có chi nhánh',
          salary: data.salary || 100000
        };
        setEmployeeData(newEmployeeData);
        setInitialEmployeeData(newEmployeeData);
      } else if (user.type === 'C') {
        // update customer-specific data
        setCustomerData({
          cumulativePoints: data.cumulative_points || 0,
          totalPoints: data.total_points || 0,
          tier: data.tier || 'B',
          lastTierUpdate: data.last_tier_update ? 
            new Date(data.last_tier_update).toISOString().split('T')[0] : ''
        });
      }
      
      // set user data
      setUserData(newUserData);
      setInitialUserData(newUserData);
      
      // update avatar preview if available
      if (userInfo.avatar) {
        setAvatarPreview(userInfo.avatar);
      }
      
      // mark as fetched to prevent duplicate calls
      setDataFetched(true);
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
      setError('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [user, dataFetched]);

  // use effect with proper dependencies
  useEffect(() => {
    if (!dataFetched) {
      fetchUserData();
    }
  }, [fetchUserData, dataFetched]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // convert field name from snake_case to camelCase if needed
    const fieldName = name === 'phone_number' ? 'phoneNumber' : 
                     name === 'citizen_id' ? 'citizenId' : 
                     name === 'full_name' ? 'fullName' : 
                     name === 'date_of_birth' ? 'dateOfBirth' : name;
    
    setUserData({
      ...userData,
      [fieldName]: newValue
    });
  };

  const handleManagerChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                     type === 'number' ? parseFloat(value) : value;
    
    setManagerData({
      ...managerData,
      [name]: newValue
    });
  };

  const handleEmployeeChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                     type === 'number' ? parseFloat(value) : value;
    
    setEmployeeData({
      ...employeeData,
      [name]: newValue
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prev => ({ ...prev, avatar: file }));
      
      // create preview for avatar
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
      // check if anything has changed in common userData
      const userDataChanged = Object.keys(userData).some(
        key => {
          if (key === 'avatar') {
            return userData[key] instanceof File;
          }
          return userData[key] !== initialUserData[key];
        }
      );
      
      // check if anything has changed in specific user type data
      let specificDataChanged = false;
      
      if (user.type === 'M') {
        specificDataChanged = Object.keys(managerData).some(
          key => managerData[key] !== initialManagerData[key]
        );
      } else if (user.type === 'E') {
        specificDataChanged = Object.keys(employeeData).some(
          key => employeeData[key] !== initialEmployeeData[key]
        );
      }
      
      const hasChanged = userDataChanged || specificDataChanged;

      if (!hasChanged) {
        setSuccess('Không có thông tin nào được thay đổi.');
        setIsLoading(false);
        setIsEditing(false);
        return;
      }

      // prepare data to update
      let updateData = {
        user: {}
      };
      
      // Check if avatar has changed
      const hasAvatarChanged = userData.avatar instanceof File
      
      // process common user info
      if (userData.phoneNumber !== initialUserData.phoneNumber) {
        updateData.user.phone_number = formatPhoneNumberForAPI(userData.phoneNumber);
      }
      
      if (userData.citizenId !== initialUserData.citizenId) {
        updateData.user.citizen_id = userData.citizenId.trim() || null;
      }
      
      if (userData.fullName !== initialUserData.fullName) {
        updateData.user.full_name = userData.fullName.trim() || null;
      }
      
      if (userData.gender !== initialUserData.gender) {
        updateData.user.gender = userData.gender;
      }
      
      if (userData.dateOfBirth !== initialUserData.dateOfBirth) {
        updateData.user.date_of_birth = userData.dateOfBirth || null;
      }
      
      if (userData.email !== initialUserData.email) {
        updateData.user.email = userData.email.trim() || null;
      }
      
      // only process specific fields for Manager and Employee
      if (user.type === 'M') {
        if (managerData.address !== initialManagerData.address) {
          updateData.address = managerData.address.trim() || null;
        }
      } else if (user.type === 'E') {
        if (employeeData.address !== initialEmployeeData.address) {
          updateData.address = employeeData.address.trim() || null;
        }
      }

      // if no user data has changed, remove user field from updateData
      if (Object.keys(updateData.user).length === 0 && !hasAvatarChanged) {
        delete updateData.user;
      }

      // if avatar has changed
      let dataToSend = null;
      
      if (hasAvatarChanged) {
        // Use form data if avatar has changed
        const formData = new FormData();
        
        formData.append('user.avatar', userData.avatar);
        
        // other user's fields
        if (updateData.user) {
          Object.keys(updateData.user).forEach(field => {
            const value = updateData.user[field];
            formData.append(`user.${field}`, value === null ? '' : value);
            console.log(`Thêm user.${field}:`, value);
          });
        }
        
        // specified field
        if (updateData.address !== undefined) {
          formData.append('address', updateData.address === null ? '' : updateData.address);
          console.log('Thêm address:', updateData.address);
        }
        
        dataToSend = formData;
      } else {
        // If avatar didn't change -> use JSON
        dataToSend = updateData;
      }
      
      // only call API if there is data to update
      if (dataToSend) {    
        let response;
        if (user.type === 'C') {
          response = await updateCustomerInfoAPI(user.id, dataToSend);
        } else if (user.type === 'A') {
          response = await updateAdminInfoAPI(user.id, dataToSend);
        } else if (user.type === 'M') {
          response = await updateManagerInfoAPI(user.id, dataToSend);
        } else if (user.type === 'E') {
          response = await updateEmployeeInfoAPI(user.id, dataToSend);
        }
      }

      // update state
      setSuccess('Thông tin đã được cập nhật thành công.');
      setIsEditing(false);
      
      // automatically reload page after 1 second to get updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
      console.error('Chi tiết lỗi:', err.response?.data);
      
      if (err.response && err.response.data) {
        // get first error from response data
        const firstErrorField = Object.keys(err.response.data)[0];
        const firstError = err.response.data[firstErrorField][0];
        setError(firstError);
      } else {
        // general error
        setError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // display different fields based on user type
  const renderUserTypeSpecificFields = () => {
    if (user.type === 'C') {
      return (
        <div className="user-type-specific-fields">
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
                value={customerData.cumulativePoints || 0} 
                disabled 
              />
            </div>
            <div className="form-group">
              <label>
                <span className="form-icon-wrapper">
                  <img src={tierIcon} alt="Cấp bậc" className="form-field-icon" />
                  Cấp bậc:
                </span>
              </label>
              <input 
                type="text" 
                value={getTierDisplayName(customerData.tier) || 'Đồng'} 
                disabled 
              />
            </div>
          </div>
        </div>
      );
    } else if (user.type === 'M') {
      return (
        <div className="user-type-specific-fields">
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
                placeholder="Nhập địa chỉ"
                value={managerData.address || ''}
                onChange={handleManagerChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>
                <span className="form-icon-wrapper">
                  <img src={yearsOfExperienceIcon} alt="Năm kinh nghiệm" className="form-field-icon" />
                  Năm kinh nghiệm:
                </span>
              </label>
              <input
                type="number"
                name="years_of_experience"
                placeholder="Nhập số năm kinh nghiệm"
                value={managerData.yearsOfExperience || 0}
                onChange={handleManagerChange}
                disabled
                min="0"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <span className="form-icon-wrapper">
                  <img src={salaryIcon} alt="Lương" className="form-field-icon" />
                  Lương:
                </span>
              </label>
              <input
                type="number"
                name="salary"
                placeholder="Nhập lương"
                value={managerData.salary || 0}
                onChange={handleManagerChange}
                disabled
                min="0"
                step="100000"
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
                value={managerData.branchName}
                disabled
              />
            </div>
          </div>
        </div>
      );
    } else if (user.type === 'E') {
      return (
        <div className="user-type-specific-fields">
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
                placeholder="Nhập địa chỉ"
                value={employeeData.address || ''}
                onChange={handleEmployeeChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>
                <span className="form-icon-wrapper">
                  <img src={departmentIcon} alt="Bộ phận" className="form-field-icon" />
                  Bộ phận:
                </span>
              </label>
              <input 
                type="text" 
                value={employeeData.departmentName} 
                disabled 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <span className="form-icon-wrapper">
                  <img src={salaryIcon} alt="Lương" className="form-field-icon" />
                  Lương:
                </span>
              </label>
              <input
                type="number"
                value={employeeData.salary || 100000}
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
              <input 
                type="text" 
                value={employeeData.branchName} 
                disabled 
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
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
                  onClick={() => {
                    setIsEditing(false);
                    setUserData(initialUserData);
                    setAvatarPreview(userData.avatar);
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
              name="phoneNumber"
              value={userData.phoneNumber}
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
              name="citizenId"
              value={userData.citizenId}
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
              name="fullName"
              value={userData.fullName}
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
              name="dateOfBirth"
              value={userData.dateOfBirth}
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