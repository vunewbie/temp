// Libraries
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// CSS
import './VerifyOTP.css';
// Components
import { ErrorsPopupWindow, SuccessfulPopupWindow } from '../../../components';
// Assets
import loginLogo from '../../../assets/logo.jpg';
import otpIcon from '../../../assets/auths/otp-icon.svg';
import verifyPicture1 from '../../../assets/auths/verify-picture1.jpg';
import verifyPicture2 from '../../../assets/auths/verify-picture2.jpg';
import verifyPicture3 from '../../../assets/auths/verify-picture3.jpg';
// API
import { registerVerifyOTPAPI, resendRegisterOTPAPI, forgotPasswordVerifyOTPAPI, resendForgotPasswordOTPAPI } from '../../../api/AuthsAPI';
// Utils
import { translateErrorMessage } from '../../../utils/errorTranslator';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verifyType, setVerifyType] = useState(null); // 'register' hoặc 'forgot_password'
  const [currentPicture, setCurrentPicture] = useState(0);
  
  // Các hình nền
  const pictures = [verifyPicture1, verifyPicture2, verifyPicture3];

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicture((prev) => (prev + 1) % pictures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pictures.length]);

  // Lấy verifyType từ URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'register' || type === 'forgot_password') {
      setVerifyType(type);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  // Kiểm tra hashed_email trong localStorage
  useEffect(() => {
    const hashedEmail = localStorage.getItem('hashedEmail');
    if (!hashedEmail) {
      navigate('/login');
    }
  }, [navigate]);

  // Xử lý đếm ngược cho nút gửi lại OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      setCountdown(60);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Set resendDisabled to true when component mounts
  useEffect(() => {
    setResendDisabled(true);
  }, []);

  // Validate OTP
  const validateOTP = () => {
    const newErrors = [];
    
    if (!otpCode) {
      newErrors.push('Vui lòng nhập mã OTP');
    } else if (!/^\d{6}$/.test(otpCode)) {
      newErrors.push('Mã OTP phải là 6 chữ số');
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
    
    // Check OTP
    if (!validateOTP()) {
      return;
    }
    
    setIsLoading(true);

    try {
      let response;

      if (verifyType === 'register') {
        const hashedEmail = localStorage.getItem('hashedEmail');
        response = await registerVerifyOTPAPI(hashedEmail, otpCode);
        
        localStorage.removeItem('hashedEmail');
        
        setSuccessMessage(response.data.message || 'Xác thực OTP thành công!'); 
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const username = localStorage.getItem('username');
        response = await forgotPasswordVerifyOTPAPI(username, otpCode);
        
        localStorage.removeItem('username');
        localStorage.setItem('resetToken', response.data.reset_token);
        
        setSuccessMessage(response.data.message || 'Xác thực OTP thành công!');
        
        setTimeout(() => {
          navigate('/reset-password');
        }, 2000);
      }
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
      console.error('Xác thực OTP thất bại:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setErrors([]);
    setIsLoading(true);
    
    try {
      let response;

      if (verifyType === 'register') {
        const hashedEmail = localStorage.getItem('hashedEmail');
        response = await resendRegisterOTPAPI(hashedEmail);
      } else {
        const username = localStorage.getItem('username');
        response = await resendForgotPasswordOTPAPI(username);
      }

      setSuccessMessage(response.data.message || 'Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.');
      setResendDisabled(true);
    } catch (error) {
      let errorMessage = 'Không thể gửi lại mã OTP. Vui lòng thử lại.';
      
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

  // Tiêu đề và mô tả dựa trên loại xác thực
  const getPageContent = () => {
    if (verifyType === 'register') {
      return {
        title: 'Xác Thực Tài Khoản',
        description: 'Vui lòng nhập mã OTP đã được gửi đến email của bạn để xác thực tài khoản.',
      };
    } else {
      return {
        title: 'Xác Thực Đặt Lại Mật Khẩu',
        description: 'Vui lòng nhập mã OTP đã được gửi đến email của bạn để đặt lại mật khẩu.',
      };
    }
  };

  const pageContent = getPageContent();

  return (
    <div className="auth-verify-otp-container">
      <div className="auth-verify-otp-wrapper">
        <div className="auth-verify-otp-form-container">
          <div className="auth-verify-otp-logo">
            <img src={loginLogo} alt="Logo" className="auth-verify-otp-logo-img" />
          </div>
          
          <h1 className="auth-verify-otp-title">{pageContent.title}</h1>
          <p className="auth-verify-otp-subtitle">Vui lòng nhập mã 6 chữ số đã được gửi đến email của bạn</p>

          <form className="auth-verify-otp-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={otpIcon} alt="OTP" className="auth-input-icon" />
                <input
                  type="text"
                  id="otp_code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Nhập mã OTP"
                  className={`auth-input ${errors.length > 0 ? 'error' : ''}`}
                  maxLength={6}
                />
              </div>
            </div>

            <button type="submit" className="auth-verify-otp-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác Nhận'}
            </button>

            <div className="auth-verify-otp-form-footer">
              <span>Không nhận được mã OTP?</span>
              <button
                type="button"
                className="resend-otp"
                onClick={handleResendOTP}
                disabled={resendDisabled}
              >
                {resendDisabled ? `Gửi lại sau ${countdown}s` : 'Gửi lại'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="auth-verify-otp-picture-container">
          <div className="auth-verify-otp-pictures">
            {pictures.map((pic, index) => (
              <img 
                key={index} 
                src={pic} 
                alt={`Verify background ${index + 1}`} 
                className={`auth-verify-otp-picture ${index === currentPicture ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="auth-verify-otp-dots">
            {pictures.map((_, index) => (
              <span 
                key={index} 
                className={`auth-verify-otp-dot ${index === currentPicture ? 'active' : ''}`}
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

export default VerifyOTP; 