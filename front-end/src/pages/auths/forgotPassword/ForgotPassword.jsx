import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { ErrorsPopupWindow, SuccessfulPopupWindow } from '../../../components';
import { 
  logo, 
  authUsernameEmailIcon, 
  forgotPicture1, 
  forgotPicture2, 
  forgotPicture3 
} from '../../../assets';
import { forgotPasswordAPI } from '../../../api';
import { translateErrorMessage } from '../../../utils';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPicture, setCurrentPicture] = useState(0);
  
  const pictures = [forgotPicture1, forgotPicture2, forgotPicture3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicture((prev) => (prev + 1) % pictures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pictures.length]);

  const validateInput = () => {
    const newErrors = [];
    
    if (!usernameOrEmail || usernameOrEmail.trim() === '') {
      newErrors.push('Vui lòng nhập tên đăng nhập hoặc email');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors([]);
    setSuccessMessage('');
    
    if (!validateInput()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await forgotPasswordAPI(usernameOrEmail);

      if (response.data && response.data.username) {
        localStorage.setItem('username', response.data.username);
      }

      setSuccessMessage(response.data.message);

      setTimeout(() => {
        navigate('/verify-otp?type=forgot_password');
      }, 2000);
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
      
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          errorMessage = translateErrorMessage(error.response.data.detail);
          console.log(errorMessage);
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
    <div className="auth-forgot-password-container">
      <div className="auth-forgot-password-wrapper">
        <div className="auth-forgot-password-form-container">
          <div className="auth-forgot-password-logo">
            <img src={logo} alt="Logo" className="auth-forgot-password-logo-img" />
          </div>
          
          <h1 className="auth-forgot-password-title">Quên Mật Khẩu</h1>
          <p className="auth-forgot-password-subtitle">Nhập tên đăng nhập hoặc email của bạn để đặt lại mật khẩu</p>

          <form className="auth-forgot-password-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={authUsernameEmailIcon} alt="Email" className="auth-input-icon" />
                <input
                  type="text"
                  id="usernameOrEmail"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Tên đăng nhập hoặc Email"
                  className={`auth-input ${errors.length > 0 ? 'error' : ''}`}
                />
              </div>
            </div>

            <button type="submit" className="auth-forgot-password-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Tiếp Tục'}
            </button>

            <div className="auth-forgot-password-form-footer">
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
        
        <div className="auth-forgot-password-picture-container">
          <div className="auth-forgot-password-pictures">
            {pictures.map((pic, index) => (
              <img 
                key={index} 
                src={pic} 
                alt={`Forgot password background ${index + 1}`} 
                className={`auth-forgot-password-picture ${index === currentPicture ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="auth-forgot-password-dots">
            {pictures.map((_, index) => (
              <span 
                key={index} 
                className={`auth-forgot-password-dot ${index === currentPicture ? 'active' : ''}`}
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

export default ForgotPassword; 