import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import { ErrorsPopupWindow, SuccessfulPopupWindow } from '../../../components';
// assets
import { 
  logo, 
  authPasswordIcon, 
  authEyeOffIcon, 
  authEyeOnIcon, 
  resetPicture1, 
  resetPicture2, 
  resetPicture3 
} from '../../../assets';
// api
import { resetPasswordAPI } from '../../../api';
// utils
import { translateErrorMessage, validatePasswordWithConfirmation } from '../../../utils';

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
  
  // pictures
  const pictures = [resetPicture1, resetPicture2, resetPicture3];

  // slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicture((prev) => (prev + 1) % pictures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pictures.length]);

  // check resetToken in localStorage
  useEffect(() => {
    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      navigate('/forgot-password');
    }
  }, [navigate]);

  // handle change input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // handle toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // validate password using the utility function
  const validatePasswordForm = () => {
    const validation = validatePasswordWithConfirmation(passwordForm.newPassword, passwordForm.confirmPassword);
    setErrors(validation.errors);
    return validation.isValid;
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // clear former errors
    setErrors([]);
    setSuccessMessage('');
    
    // validate form
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const resetToken = localStorage.getItem('resetToken');
      const response = await resetPasswordAPI(resetToken, passwordForm.newPassword);

      // set success message
      setSuccessMessage(response.data.message || 'Mật khẩu đã được đặt lại thành công!');
      
      // remove resetToken from localStorage
      localStorage.removeItem('resetToken');

      // redirect to login page after 2 seconds
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

  // close errors popup
  const handleCloseErrors = () => {
    setErrors([]);
  };

  // close success popup
  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };

  return (
    <div className="auth-reset-password-container">
      <div className="auth-reset-password-wrapper">
        <div className="auth-reset-password-form-container">
          <div className="auth-reset-password-logo">
            <img src={logo} alt="Logo" className="auth-reset-password-logo-img" />
          </div>
          
          <h1 className="auth-reset-password-title">Đặt Lại Mật Khẩu</h1>
          <p className="auth-reset-password-subtitle">Nhập mật khẩu mới của bạn</p>

          <form className="auth-reset-password-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={authPasswordIcon} alt="Password" className="auth-input-icon" />
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
                  src={showPassword.newPassword ? authEyeOnIcon : authEyeOffIcon} 
                  alt="Toggle password" 
                  className="auth-password-toggle"
                  onClick={() => togglePasswordVisibility('newPassword')}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={authPasswordIcon} alt="Password" className="auth-input-icon" />
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
                  src={showPassword.confirmPassword ? authEyeOnIcon : authEyeOffIcon} 
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