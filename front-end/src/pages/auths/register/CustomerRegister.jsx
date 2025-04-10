import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerRegister.css';
import { ErrorsPopupWindow, SuccessfulPopupWindow } from '../../../components';
// assets
import { 
  logo as loginLogo,
  authUsernameEmailIcon as usernameIcon,
  authEmailIcon as emailIcon,
  authPasswordIcon as passwordIcon,
  authEyeOffIcon as eyeOffIcon,
  authEyeOnIcon as eyeOnIcon,
  googleIcon, facebookIcon, githubIcon,
  registerPicture1, registerPicture2, registerPicture3
} from '../../../assets';
// api
import { customerRegisterAPI, getGoogleOAuth2CodeAPI, getFacebookOAuth2CodeAPI, getGitHubOAuth2CodeAPI } from "../../../api";
// utils
import { validatePasswordWithConfirmation } from '../../../utils';

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

  // slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicture((prev) => (prev + 1) % pictures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pictures.length]);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prevState => ({
      ...prevState,
      [name]: value
    }));

    // check password and confirm password
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

  // display password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // display confirm password 
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // validate form
  const validateForm = () => {
    const newErrors = [];
    
    // check username
    if (authForm.username.length < 3) {
      newErrors.push('Tên đăng nhập phải có ít nhất 3 ký tự');
    }

    // check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authForm.email)) {
      newErrors.push('Email không hợp lệ');
    }

    // check password and confirm password using the utility function
    const passwordValidation = validatePasswordWithConfirmation(authForm.password, authForm.confirmPassword);
    if (!passwordValidation.isValid) {
      newErrors.push(...passwordValidation.errors);
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
    
    // check form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // API   call
      const response = await customerRegisterAPI(authForm.username, authForm.email, authForm.password);
      
      // save hashed email to localStorage
      localStorage.setItem('hashedEmail', response.data.hashed_email);
      // set success message for popup window
      setSuccessMessage(response.data.message);
      
      // redirect to verify OTP page after 2 seconds
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

  // close errors popup
  const handleCloseErrors = () => {
    setErrors([]);
  };

  // close success popup
  const handleCloseSuccess = () => {
    setSuccessMessage('');
    navigate('/login');
  };

  const handleGoogleLoginClick = () => {
    getGoogleOAuth2CodeAPI();
  };

  const handleFacebookLoginClick = () => {
    getFacebookOAuth2CodeAPI();
  };

  const handleGitHubLoginClick = () => {
    getGitHubOAuth2CodeAPI();
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
              <button type="button" className="auth-social-button" onClick={handleGoogleLoginClick}>
                <img src={googleIcon} alt="Google" className="auth-social-icon" />
                <span>Google</span>
              </button>
              
              <button type="button" className="auth-social-button" onClick={handleFacebookLoginClick}>
                <img src={facebookIcon} alt="Facebook" className="auth-social-icon" />
                <span>Facebook</span>
              </button>
              
              <button type="button" className="auth-social-button" onClick={handleGitHubLoginClick}>
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