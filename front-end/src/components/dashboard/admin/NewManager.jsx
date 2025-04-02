import React, { useState, useEffect } from 'react';
import { listBranchInfoAPI } from '../../../api/establishments/BranchAPI';
import { createManagerAPI } from '../../../api/accounts/ManagerAPI';
import { formatPhoneNumberForAPI } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import './NewManager.css';
// all icons from assets
import { 
  usernameIcon, emailIcon, phoneNumberIcon, citizenIdIcon, fullnameIcon,
  genderIcon, dateOfBirthIcon, addressIcon, branchIcon, passwordIcon,
  yearsOfExperienceIcon, salaryIcon
} from '../../../assets';

const NewManager = () => {
  const navigate = useNavigate();
  
  // manager data state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    citizenId: '',
    fullName: '',
    gender: 'M',
    dateOfBirth: '',
    address: '',
    branch: '',
    yearsOfExperience: 0,
    salary: 0,
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
  // branches list
  const [branches, setBranches] = useState([]);

  // fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchesData = await listBranchInfoAPI();
        setBranches(branchesData);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách chi nhánh:', err);
        setErrors(['Không thể lấy danh sách chi nhánh. Vui lòng thử lại sau.']);
      }
    };
    
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Convert salary and yearsOfExperience to numbers
    if (name === 'salary' || name === 'yearsOfExperience') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: newValue
      });
    }
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

  const validatePasswordWithConfirmation = (password, confirmPassword) => {
    const errors = [];
    
    // Check if password has enough length
    if (!password || password.length < 8) {
      errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }
    
    // Check if confirm password matches
    if (password !== confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }
    
    // Check if password is strong enough (has uppercase, lowercase and number),special character is optional
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialCharacter)) {
      errors.push('Mật khẩu phải có ít nhất một chữ hoa, một chữ thường và một số, ký tự đặc biệt là tùy chọn');
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
    const requiredFields = ['phoneNumber', 'citizenId', 'fullName', 'dateOfBirth', 'branch'];
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

    // Validate trường số
    if (formData.yearsOfExperience < 0) {
      newErrors.push('Số năm kinh nghiệm không thể là số âm');
    }
    
    if (formData.salary < 0) {
      newErrors.push('Lương không thể là số âm');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const getFieldLabel = (fieldName) => {
    const labels = {
      username: 'Tên Đăng Nhập',
      email: 'Email',
      phoneNumber: 'Số Điện Thoại',
      citizenId: 'CMND/CCCD',
      fullName: 'Họ Và Tên',
      dateOfBirth: 'Ngày Sinh',
      branch: 'Chi Nhánh',
      yearsOfExperience: 'Năm Kinh Nghiệm',
      salary: 'Lương',
      password: 'Mật Khẩu',
      confirmPassword: 'Nhập Lại Mật Khẩu',
      address: 'Địa Chỉ'
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
      
      // Add manager data
      formDataToSend.append('address', formData.address);
      formDataToSend.append('branch', formData.branch);
      formDataToSend.append('years_of_experience', formData.yearsOfExperience);
      formDataToSend.append('salary', formData.salary);
      
      // Add avatar if provided
      if (formData.avatar) {
        formDataToSend.append('user.avatar', formData.avatar);
      }
      
      // Send request to API
      const response = await createManagerAPI(formDataToSend);
      
      // Handle successful response
      setSuccess('Đăng ký thành công!');
      
      // Save hashed_email to localStorage for OTP verification
      if (response.hashed_email) {
        localStorage.setItem('hashedEmail', response.hashed_email);
        // Redirect to verification page after a short delay
        setTimeout(() => {
          navigate('/verify-otp?type=register');
        }, 1000);
      }
    } catch (err) {
      console.error('Lỗi khi đăng ký quản lý:', err);
      
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
    <div className="new-manager-container">
      <h2>Đăng ký quản lý mới</h2>
      
      {errors.length > 0 && <div className="new-manager-error-message">{errors.join('\n')}</div>}
      {success && <div className="new-manager-success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="new-manager-form-header">
          <div className="new-manager-avatar-section">
            <div className="new-manager-avatar-container">
              <img 
                src={avatarPreview || '/default-avatar.png'} 
                alt="Avatar" 
                className="new-manager-avatar-preview" 
              />
              <label htmlFor="avatar-input" className="new-manager-avatar-upload-label">
                Thay đổi
              </label>
              <input 
                type="file" 
                id="avatar-input" 
                className="new-manager-avatar-input" 
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>
        
        <div className="new-manager-form-content">
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={usernameIcon} alt="Username Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={emailIcon} alt="Email Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={phoneNumberIcon} alt="Phone Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={citizenIdIcon} alt="Citizen ID Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={fullnameIcon} alt="Fullname Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={genderIcon} alt="Gender Icon" />
            </div>
            <div className="new-manager-input-wrapper">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="M">Nam</option>
                <option value="F">Nữ</option>
              </select>
            </div>
          </div>
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={dateOfBirthIcon} alt="Date Of Birth Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={branchIcon} alt="Branch Icon" />
            </div>
            <div className="new-manager-input-wrapper">
              <label htmlFor="branch">Chi nhánh</label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={yearsOfExperienceIcon} alt="Years Of Experience Icon" />
            </div>
            <div className="new-manager-input-wrapper">
              <label htmlFor="yearsOfExperience">Số năm kinh nghiệm</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="Nhập số năm kinh nghiệm"
              />
            </div>
          </div>
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={salaryIcon} alt="Salary Icon" />
            </div>
            <div className="new-manager-input-wrapper">
              <label htmlFor="salary">Lương</label>
              <input
                type="number"
                id="salary"
                name="salary"
                min="0"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Nhập mức lương"
              />
            </div>
          </div>
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={passwordIcon} alt="Password Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
          
          <div className="new-manager-input-group">
            <div className="new-manager-input-icon">
              <img src={passwordIcon} alt="Confirm Password Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
        
        <div className="new-manager-address-section">
          <div className="new-manager-input-group full-width">
            <div className="new-manager-input-icon">
              <img src={addressIcon} alt="Address Icon" />
            </div>
            <div className="new-manager-input-wrapper">
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
        
        <div className="new-manager-form-actions">
          <button 
            type="submit" 
            className="new-manager-save-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewManager; 