import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifyOTP.css';
import { ErrorsPopupWindow, SuccessfulPopupWindow } from '../../../components';
import { logo, otpIcon, verifyPicture1, verifyPicture2, verifyPicture3 } from '../../../assets';
import { registerVerifyOTPAPI, resendRegisterOTPAPI, forgotPasswordVerifyOTPAPI, resendForgotPasswordOTPAPI } from '../../../api';
import { translateErrorMessage } from '../../../utils';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verifyType, setVerifyType] = useState(null); // 'register' or 'forgot_password'
  const [currentPicture, setCurrentPicture] = useState(0);
  
  // pictures
  const pictures = [verifyPicture1, verifyPicture2, verifyPicture3];

  // slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicture((prev) => (prev + 1) % pictures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pictures.length]);

  // get verifyType from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'register' || type === 'forgot_password') {
      setVerifyType(type);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  // check hashed_email in localStorage
  useEffect(() => {
    const hashedEmail = localStorage.getItem('hashedEmail');
    if (!hashedEmail) {
      navigate('/login');
    }
  }, [navigate]);

  // handle countdown for resend OTP button
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

  // set resendDisabled to true when component mounts
  useEffect(() => {
    setResendDisabled(true);
  }, []);

  // validate OTP
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

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // clear former errors
    setErrors([]);
    setSuccessMessage('');
    
    // check OTP
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
          navigate('/');
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

  // handle resend OTP
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

  // close errors popup
  const handleCloseErrors = () => {
    setErrors([]);
  };

  // close success popup
  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };

  // title and description based on verify type
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
            <img src={logo} alt="Logo" className="auth-verify-otp-logo-img" />
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