// Libraries
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// CSS
import './CustomerRegister.css';
// Components
import { ErrorsPopupWindow, SuccessfulPopupWindow } from '../../../components';
// Assets
import loginLogo from '../../../assets/logo.jpg';
import usernameIcon from '../../../assets/auths/username-email-icon.svg';
import emailIcon from '../../../assets/auths/email-icon.svg';
import passwordIcon from '../../../assets/auths/password-icon.svg';
import eyeOffIcon from '../../../assets/auths/eye-off-icon.svg';
import eyeOnIcon from '../../../assets/auths/eye-on-icon.svg';
import googleIcon from '../../../assets/auths/google-icon.svg';
import facebookIcon from '../../../assets/auths/facebook-icon.svg';
import githubIcon from '../../../assets/auths/github-icon.svg';
import registerPicture1 from '../../../assets/auths/register-picture1.jpg';
import registerPicture2 from '../../../assets/auths/register-picture2.jpg';
import registerPicture3 from '../../../assets/auths/register-picture3.jpg';
// API
import { customerRegisterAPI } from '../../../api/AuthsAPI';

const Register = () => {
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(0);
  const navigate = useNavigate();
  const pictures = [registerPicture1, registerPicture2, registerPicture3];

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicture((prev) => (prev + 1) % pictures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pictures.length]);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Check password and confirm password
    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'password' && authForm.confirmPassword && value !== authForm.confirmPassword) {
        setPasswordError('Mật khẩu nhập lại không khớp');
      } else if (name === 'confirmPassword' && value !== authForm.password) {
        setPasswordError('Mật khẩu nhập lại không khớp');
      } else {
        setPasswordError('');
      }
    }
  };

  // Display password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Display confirm password 
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = [];
    
    // Check username
    if (authForm.username.length < 3) {
      newErrors.push('Tên đăng nhập phải có ít nhất 3 ký tự');
    }

    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authForm.email)) {
      newErrors.push('Email không hợp lệ');
    }

    // Check password
    if (authForm.password.length < 6) {
      newErrors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    // Check confirm password
    if (authForm.password !== authForm.confirmPassword) {
      newErrors.push('Mật khẩu nhập lại không khớp');
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
    
    // Check form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // API call
      const response = await customerRegisterAPI(authForm.username, authForm.email, authForm.password);
      
      // Save hashed email to localStorage
      localStorage.setItem('hashedEmail', response.data.hashed_email);
      // Set success message for popup window
      setSuccessMessage(response.data.message);
      
      // Redirect to verify OTP page after 2 seconds
      setTimeout(() => {
        navigate('/verify-otp?type=register');
      }, 2000);
    } catch (error) {
      setErrors([error.response.message || 'Có lỗi xảy ra. Vui lòng thử lại.']);
      console.error('Đăng ký thất bại:', error);
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
    navigate('/login');
  };

  return (
    <div className="auth-register-container">
      <div className="auth-register-wrapper">
        <div className="auth-register-form-container">
          <div className="auth-register-logo">
            <img src={loginLogo} alt="Logo" className="auth-register-logo-img" />
          </div>
          
          <h1 className="auth-register-title">Đăng Ký</h1>
          
          <form className="auth-register-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={usernameIcon} alt="Username" className="auth-input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Tên Đăng Nhập"
                  value={authForm.username}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>
            
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={emailIcon} alt="Email" className="auth-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>
            
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={passwordIcon} alt="Password" className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Mật Khẩu"
                  value={authForm.password}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
                <img 
                  src={showPassword ? eyeOnIcon : eyeOffIcon} 
                  alt="Toggle password" 
                  className="auth-password-toggle"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
            
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={passwordIcon} alt="Confirm Password" className="auth-input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Nhập Lại Mật Khẩu"
                  value={authForm.confirmPassword}
                  onChange={handleChange}
                  className={`auth-input ${passwordError ? 'auth-input-error' : ''}`}
                  required
                />
                <img 
                  src={showConfirmPassword ? eyeOnIcon : eyeOffIcon} 
                  alt="Toggle confirm password" 
                  className="auth-password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
              {passwordError && <div className="auth-password-error">{passwordError}</div>}
            </div>
            
            <button 
              type="submit" 
              className="auth-register-button"
              disabled={isLoading || passwordError}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
            
            <div className="auth-divider">
              <span>Đăng Ký Với</span>
            </div>
            
            <div className="auth-social-login">
              <button type="button" className="auth-social-button">
                <img src={googleIcon} alt="Google" className="auth-social-icon" />
                <span>Google</span>
              </button>
              
              <button type="button" className="auth-social-button">
                <img src={facebookIcon} alt="Facebook" className="auth-social-icon" />
                <span>Facebook</span>
              </button>
              
              <button type="button" className="auth-social-button">
                <img src={githubIcon} alt="GitHub" className="auth-social-icon" />
                <span>GitHub</span>
              </button>
            </div>
            
            <div className="auth-login-link">
              <p>Đã có tài khoản? <Link to="/login">Đăng Nhập Ngay</Link></p>
            </div>
          </form>
        </div>
        
        <div className="auth-register-picture-container">
          <div className="auth-register-pictures">
            {pictures.map((pic, index) => (
              <img 
                key={index} 
                src={pic} 
                alt={`Register background ${index + 1}`} 
                className={`auth-register-picture ${index === currentPicture ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="auth-register-dots">
            {pictures.map((_, index) => (
              <span 
                key={index} 
                className={`auth-register-dot ${index === currentPicture ? 'active' : ''}`}
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

export default Register; 