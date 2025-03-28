import React, { useState, useEffect } from 'react';
import { listDepartmentInfoAPI } from '../../../api/establishments/DepartmentAPI';
import { createEmployeeAPI } from '../../../api/accounts/EmployeeAPI';
import { formatPhoneNumberForAPI } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import './NewEmployee.css';
// all icons from assets
import { 
  usernameIcon, emailIcon, phoneNumberIcon, citizenIdIcon, fullnameIcon,
  genderIcon, dateOfBirthIcon, addressIcon, departmentIcon, passwordIcon
} from '../../../assets';

const NewEmployee = () => {
  const navigate = useNavigate();
  
  // employee data state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    citizenId: '',
    fullName: '',
    gender: 'M',
    dateOfBirth: '',
    address: '',
    department: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  
  // avatar preview
  const [avatarPreview, setAvatarPreview] = useState('');
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  // error state
  const [errors, setErrors] = useState([]);
  // success state
  const [success, setSuccess] = useState('');
  // departments list
  const [departments, setDepartments] = useState([]);

  // fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await listDepartmentInfoAPI();
        setDepartments(departmentsData);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách bộ phận:', err);
        setErrors(['Không thể lấy danh sách bộ phận. Vui lòng thử lại sau.']);
      }
    };
    
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setFormData({
        ...formData,
        avatar: file
      });
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm kiểm tra mật khẩu và xác nhận mật khẩu
  const validatePasswordWithConfirmation = (password, confirmPassword) => {
    const errors = [];
    
    // Kiểm tra mật khẩu có đủ độ dài không
    if (!password || password.length < 8) {
      errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }
    
    // Kiểm tra xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }
    
    // Kiểm tra mật khẩu có đủ mạnh không (có chữ hoa, chữ thường và số)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumber)) {
      errors.push('Mật khẩu phải có ít nhất một chữ hoa, một chữ thường và một số');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  };

  const validateForm = () => {
    const newErrors = [];
    
    // validate avatar
    if (!formData.avatar) {
      newErrors.push('Ảnh đại diện là bắt buộc');
    }

    // check username
    if (formData.username.length < 3) {
      newErrors.push('Tên đăng nhập phải có ít nhất 3 ký tự');
    }

    // check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.push('Email không hợp lệ');
    }

    // check password and confirm password using the utility function
    const passwordValidation = validatePasswordWithConfirmation(formData.password, formData.confirmPassword);
    if (!passwordValidation.isValid) {
      newErrors.push(...passwordValidation.errors);
    }
    
    // validate required fields
    const requiredFields = ['phoneNumber', 'citizenId', 'fullName', 'dateOfBirth', 'department'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors.push(`${getFieldLabel(field)} là bắt buộc`);
      }
    });

    // validate phone number
    if (formData.phoneNumber && !/^\d{9,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.push('Số điện thoại không hợp lệ');
    }

    // validate citizen ID
    if (formData.citizenId && !/^\d{9,12}$/.test(formData.citizenId.replace(/\D/g, ''))) {
      newErrors.push('Số CMND/CCCD không hợp lệ');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const getFieldLabel = (fieldName) => {
    const labels = {
      username: 'tên đăng nhập',
      email: 'email',
      phoneNumber: 'số điện thoại',
      citizenId: 'CMND/CCCD',
      fullName: 'họ và tên',
      dateOfBirth: 'ngày sinh',
      department: 'bộ phận',
      password: 'mật khẩu',
      confirmPassword: 'nhập lại mật khẩu',
      address: 'địa chỉ'
    };
    
    return labels[fieldName] || fieldName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors([]);
    setSuccess('');
    
    try {
      // Prepare data for API
      const formDataToSend = new FormData();
      
      // Add user data
      formDataToSend.append('user.username', formData.username);
      formDataToSend.append('user.email', formData.email);
      formDataToSend.append('user.phone_number', formatPhoneNumberForAPI(formData.phoneNumber));
      formDataToSend.append('user.citizen_id', formData.citizenId);
      formDataToSend.append('user.full_name', formData.fullName);
      formDataToSend.append('user.gender', formData.gender);
      formDataToSend.append('user.date_of_birth', formData.dateOfBirth);
      formDataToSend.append('user.password', formData.password);
      
      // Add employee data
      formDataToSend.append('address', formData.address);
      formDataToSend.append('department', formData.department);
      
      // Add avatar if provided
      if (formData.avatar) {
        formDataToSend.append('user.avatar', formData.avatar);
      }
      
      // Send request to API
      const response = await createEmployeeAPI(formDataToSend);
      
      // Handle successful response
      setSuccess('Đăng ký thành công!');
      
      // Save hashed_email to localStorage for OTP verification
      if (response.hashed_email) {
        localStorage.setItem('hashedEmail', response.hashed_email);
        // Redirect to verification page after a short delay
        setTimeout(() => {
          navigate('/verify-otp?type=register');
        }, 1500);
      }
    } catch (err) {
      console.error('Lỗi khi đăng ký nhân viên:', err);
      
      if (err.response && err.response.data) {
        // Handle validation errors from the backend
        const errorData = err.response.data;
        let errorMessage = '';
        
        if (typeof errorData === 'object') {
          // Process error object to create a readable message
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              errorMessage += `${key}: ${errorData[key].join(', ')}; `;
            } else if (typeof errorData[key] === 'object') {
              Object.keys(errorData[key]).forEach(subKey => {
                errorMessage += `${subKey}: ${errorData[key][subKey].join(', ')}; `;
              });
            } else {
              errorMessage += `${key}: ${errorData[key]}; `;
            }
          });
        } else {
          errorMessage = 'Đã xảy ra lỗi khi đăng ký';
        }
        
        setErrors([errorMessage || 'Đã xảy ra lỗi khi đăng ký']);
      } else {
        setErrors(['Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recruitment-container">
      <h2>Đăng ký nhân viên mới</h2>
      
      {errors.length > 0 && <div className="recruit-error-message">{errors.join('\n')}</div>}
      {success && <div className="recruit-success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="recruit-form-header">
          <div className="recruit-avatar-section">
            <div className="recruit-avatar-container">
              <img 
                src={avatarPreview || '/default-avatar.png'} 
                alt="Avatar" 
                className="recruit-avatar-preview" 
              />
              <label htmlFor="avatar-input" className="recruit-avatar-upload-label">
                Thay đổi
              </label>
              <input 
                type="file" 
                id="avatar-input" 
                className="recruit-avatar-input" 
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>
        
        <div className="recruit-form-content">
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={usernameIcon} alt="Username Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={emailIcon} alt="Email Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập địa chỉ email"
              />
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={phoneNumberIcon} alt="Phone Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={citizenIdIcon} alt="Citizen ID Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="citizenId">CMND/CCCD</label>
              <input
                type="text"
                id="citizenId"
                name="citizenId"
                value={formData.citizenId}
                onChange={handleChange}
                placeholder="Nhập số CMND/CCCD"
              />
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={fullnameIcon} alt="Fullname Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={genderIcon} alt="Gender Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="M">Nam</option>
                <option value="F">Nữ</option>
                <option value="O">Khác</option>
              </select>
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={dateOfBirthIcon} alt="Date Of Birth Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="dateOfBirth">Ngày sinh</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={departmentIcon} alt="Department Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="department">Bộ phận</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">-- Chọn bộ phận --</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={passwordIcon} alt="Password Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>
          
          <div className="recruit-input-group">
            <div className="recruit-input-icon">
              <img src={passwordIcon} alt="Confirm Password Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </div>
        </div>
        
        <div className="recruit-address-section">
          <div className="recruit-input-group full-width">
            <div className="recruit-input-icon">
              <img src={addressIcon} alt="Address Icon" />
            </div>
            <div className="recruit-input-wrapper">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
        </div>
        
        <div className="recruit-form-actions">
          <button 
            type="submit" 
            className="recruit-save-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewEmployee; 