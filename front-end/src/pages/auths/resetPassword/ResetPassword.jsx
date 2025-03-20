// Libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// CSS
import './ResetPassword.css';
// Components
import { ErrorsPopupWindow, SuccessfulPopupWindow } from '../../../components';
// Assets
import loginLogo from '../../../assets/logo.jpg';
import passwordIcon from '../../../assets/auths/password-icon.svg';
import eyeOffIcon from '../../../assets/auths/eye-off-icon.svg';
import eyeOnIcon from '../../../assets/auths/eye-on-icon.svg';
import resetPicture1 from '../../../assets/auths/reset-picture1.jpg';
import resetPicture2 from '../../../assets/auths/reset-picture2.jpg';
import resetPicture3 from '../../../assets/auths/reset-picture3.jpg';
// API
import { resetPasswordAPI } from '../../../api/AuthsAPI';
// Utils
import { translateErrorMessage } from '../../../utils/errorTranslator';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPicture, setCurrentPicture] = useState(0);
  
  // Các hình nền
  const pictures = [resetPicture1, resetPicture2, resetPicture3];

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicture((prev) => (prev + 1) % pictures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pictures.length]);

  // Kiểm tra resetToken trong localStorage
  useEffect(() => {
    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      navigate('/forgot-password');
    }
  }, [navigate]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý hiển thị/ẩn mật khẩu
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate mật khẩu
  const validatePasswordForm = () => {
    const newErrors = [];
    
    // Kiểm tra mật khẩu mới
    if (!passwordForm.newPassword) {
      newErrors.push('Vui lòng nhập mật khẩu mới');
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.push('Mật khẩu phải có ít nhất 8 ký tự');
    } else if (!/[A-Z]/.test(passwordForm.newPassword)) {
      newErrors.push('Mật khẩu phải có ít nhất 1 chữ cái viết hoa');
    } else if (!/[a-z]/.test(passwordForm.newPassword)) {
      newErrors.push('Mật khẩu phải có ít nhất 1 chữ cái viết thường');
    } else if (!/[0-9]/.test(passwordForm.newPassword)) {
      newErrors.push('Mật khẩu phải có ít nhất 1 chữ số');
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword)) {
      newErrors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
    }
    
    // Kiểm tra xác nhận mật khẩu
    if (!passwordForm.confirmPassword) {
      newErrors.push('Vui lòng xác nhận mật khẩu mới');
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      newErrors.push('Xác nhận mật khẩu không khớp');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear former errors
    setErrors([]);
    setSuccessMessage('');
    
    // Validate form
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const resetToken = localStorage.getItem('resetToken');
      const response = await resetPasswordAPI(resetToken, passwordForm.newPassword);

      // Set success message
      setSuccessMessage(response.data.message || 'Mật khẩu đã được đặt lại thành công!');
      
      // Xóa resetToken khỏi localStorage
      localStorage.removeItem('resetToken');

      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
      
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          errorMessage = translateErrorMessage(error.response.data.detail);
        } else if (error.response.data.message) {
          errorMessage = translateErrorMessage(error.response.data.message);
        }
      }
      
      setErrors([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Close errors popup
  const handleCloseErrors = () => {
    setErrors([]);
  };

  // Close success popup
  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };

  return (
    <div className="auth-reset-password-container">
      <div className="auth-reset-password-wrapper">
        <div className="auth-reset-password-form-container">
          <div className="auth-reset-password-logo">
            <img src={loginLogo} alt="Logo" className="auth-reset-password-logo-img" />
          </div>
          
          <h1 className="auth-reset-password-title">Đặt Lại Mật Khẩu</h1>
          <p className="auth-reset-password-subtitle">Nhập mật khẩu mới của bạn</p>

          <form className="auth-reset-password-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={passwordIcon} alt="Password" className="auth-input-icon" />
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handleChange}
                  placeholder="Mật khẩu mới"
                  className={`auth-input ${errors.length > 0 ? 'error' : ''}`}
                />
                <img 
                  src={showPassword.newPassword ? eyeOnIcon : eyeOffIcon} 
                  alt="Toggle password" 
                  className="auth-password-toggle"
                  onClick={() => togglePasswordVisibility('newPassword')}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={passwordIcon} alt="Password" className="auth-input-icon" />
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handleChange}
                  placeholder="Xác nhận mật khẩu mới"
                  className={`auth-input ${errors.length > 0 ? 'error' : ''}`}
                />
                <img 
                  src={showPassword.confirmPassword ? eyeOnIcon : eyeOffIcon} 
                  alt="Toggle password" 
                  className="auth-password-toggle"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                />
              </div>
            </div>

            <button type="submit" className="auth-reset-password-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
            </button>

            <div className="auth-reset-password-form-footer">
              <span>Đã nhớ mật khẩu?</span>
              <button
                type="button"
                className="back-to-login"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
        
        <div className="auth-reset-password-picture-container">
          <div className="auth-reset-password-pictures">
            {pictures.map((pic, index) => (
              <img 
                key={index} 
                src={pic} 
                alt={`Reset password background ${index + 1}`} 
                className={`auth-reset-password-picture ${index === currentPicture ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="auth-reset-password-dots">
            {pictures.map((_, index) => (
              <span 
                key={index} 
                className={`auth-reset-password-dot ${index === currentPicture ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Errors Popup Window */}
      <ErrorsPopupWindow 
        errors={errors} 
        onClose={handleCloseErrors}
      />

      {/* Success Popup Window */}
      <SuccessfulPopupWindow
        message={successMessage}
        onClose={handleCloseSuccess}
      />
    </div>
  );
};

export default ResetPassword; 