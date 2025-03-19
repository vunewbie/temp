import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { getGoogleOAuth2Code, getFacebookOAuth2Code, getGitHubOAuth2Code } from "../../../api/Auths";
import { useAuth } from '../../../context/AuthContext';
import loginLogo from '../../../assets/logo.jpg';
import usernameIcon from '../../../assets/auths/username-email-icon.svg';
import passwordIcon from '../../../assets/auths/password-icon.svg';
import eyeOffIcon from '../../../assets/auths/eye-off-icon.svg';
import eyeOnIcon from '../../../assets/auths/eye-on-icon.svg';
import googleIcon from '../../../assets/auths/google-icon.svg';
import facebookIcon from '../../../assets/auths/facebook-icon.svg';
import githubIcon from '../../../assets/auths/github-icon.svg';
import loginPicture1 from '../../../assets/auths/login-picture1.jpg';
import loginPicture2 from '../../../assets/auths/login-picture2.jpg';
import loginPicture3 from '../../../assets/auths/login-picture3.jpg';

const Login = () => {
  const { login } = useAuth();
  const [authForm, setAuthForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(0);
  const navigate = useNavigate();

  const pictures = [loginPicture1, loginPicture2, loginPicture3];

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPicture((prev) => (prev + 1) % pictures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pictures.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAuthForm(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Sử dụng login từ AuthContext
      await login(authForm.username, authForm.password);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        // Check if the account is not verified
        if (error.response.data.require_verification && 
            error.response.data.require_verification.includes('True') && 
            error.response.data.hashed_email) {
          
          // Save hashed email to localStorage
          localStorage.setItem('hashedEmail', error.response.data.hashed_email[0]);
          
          // Show error message
          setError('Tài khoản chưa được xác thực. Đang chuyển hướng đến trang xác thực OTP...');
          
          // Redirect to OTP verification page after 2 seconds
          setTimeout(() => {
            navigate('/verify-otp?type=register');
          }, 2000);
          
          return;
        }
        
        setError(error.response.data.detail || 'Đăng nhập thất bại. Vui lòng thử lại!');
      } else {
        setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    getGoogleOAuth2Code();
  };

  const handleFacebookLoginClick = () => {
    getFacebookOAuth2Code();
  };

  const handleGitHubLoginClick = () => {
    getGitHubOAuth2Code();
  };

  return (
    <div className="auth-login-container">
      <div className="auth-login-wrapper">
        <div className="auth-login-form-container">
          <div className="auth-login-logo">
            <img src={loginLogo} alt="Logo" className="auth-login-logo-img" />
          </div>
          
          <h1 className="auth-login-title">Đăng Nhập</h1>
          
          {error && <div className="auth-error-message">{error}</div>}
          
          <form className="auth-login-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-container">
                <img src={usernameIcon} alt="Username" className="auth-input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Tên Đăng Nhập hoặc Email"
                  value={authForm.username}
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
            
            <div className="auth-form-options">
              <div className="auth-remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={authForm.rememberMe}
                  onChange={handleChange}
                  className="auth-checkbox"
                />
                <label htmlFor="rememberMe">Ghi Nhớ Đăng Nhập</label>
              </div>
              <Link to="/forgot-password" className="auth-forgot-password">Quên Mật Khẩu?</Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
            
            <div className="auth-divider">
              <span>Đăng Nhập Với</span>
            </div>
            
            <div className="auth-social-login">
              <button 
                type="button" 
                className="auth-social-button"
                onClick={handleGoogleLoginClick}
              >
                <img src={googleIcon} alt="Google" className="auth-social-icon" />
                <span>Google</span>
              </button>
              
              <button 
                type="button" 
                className="auth-social-button"
                onClick={handleFacebookLoginClick}
              >
                <img src={facebookIcon} alt="Facebook" className="auth-social-icon" />
                <span>Facebook</span>
              </button>
              
              <button 
                type="button" 
                className="auth-social-button"
                onClick={handleGitHubLoginClick}
              >
                <img src={githubIcon} alt="GitHub" className="auth-social-icon" />
                <span>GitHub</span>
              </button>
            </div>
            
            <div className="auth-register-link">
              <p>Chưa có tài khoản? <Link to="/register">Đăng Ký Ngay</Link></p>
            </div>
          </form>
        </div>
        
        <div className="auth-login-picture-container">
          <div className="auth-login-pictures">
            {pictures.map((pic, index) => (
              <img 
                key={index} 
                src={pic} 
                alt={`Login background ${index + 1}`} 
                className={`auth-login-picture ${index === currentPicture ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="auth-login-dots">
            {pictures.map((_, index) => (
              <span 
                key={index} 
                className={`auth-login-dot ${index === currentPicture ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 