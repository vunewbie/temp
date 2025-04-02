import React, { useState } from 'react';
import './ChangePassword.css';
import { eyeOffIcon, eyeOnIcon } from '../../assets';
import { changePasswordAPI } from '../../api';
import { translateErrorMessage, validatePassword, validateConfirmPassword } from '../../utils';

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });

    // clear validation error when user starts typing again
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // check current password
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    // check new password using the utility function
    const passwordResult = validatePassword(passwordData.newPassword);
    if (!passwordResult.isValid) {
      errors.newPassword = passwordResult.errors[0]; // Get the first error
    }
    
    // check confirm password using the utility function
    const confirmResult = validateConfirmPassword(passwordData.newPassword, passwordData.confirmPassword);
    if (!confirmResult.isValid) {
      errors.confirmPassword = confirmResult.error;
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // check validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('Đổi mật khẩu thành công!');
    
    try {
      const response = await changePasswordAPI(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      setSuccess('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // reset password visibility
      setPasswordVisibility({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      });
    } catch (err) {
      console.error('Lỗi khi đổi mật khẩu:', err);
      let errorMessage = 'Đã xảy ra lỗi khi đổi mật khẩu.';
      
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        
        if (errorData.detail) {
          errorMessage = translateErrorMessage(errorData.detail);
        } else if (errorData.old_password) {
          errorMessage = translateErrorMessage(errorData.old_password[0]);
        } else if (errorData.new_password) {
          errorMessage = translateErrorMessage(errorData.new_password[0]);
        } else if (errorData.non_field_errors) {
          errorMessage = translateErrorMessage(errorData.non_field_errors[0]);
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Đổi mật khẩu</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
          <div className="password-input-container">
            <input
              type={passwordVisibility.currentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              className={validationErrors.currentPassword ? "error" : ""}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('currentPassword')}
            >
              <img 
                src={passwordVisibility.currentPassword ? eyeOnIcon : eyeOffIcon} 
                alt={passwordVisibility.currentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} 
                className="eye-icon"
              />
            </button>
          </div>
          {validationErrors.currentPassword && (
            <div className="validation-error">{validationErrors.currentPassword}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <div className="password-input-container">
            <input
              type={passwordVisibility.newPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              className={validationErrors.newPassword ? "error" : ""}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('newPassword')}
            >
              <img 
                src={passwordVisibility.newPassword ? eyeOnIcon : eyeOffIcon} 
                alt={passwordVisibility.newPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} 
                className="eye-icon"
              />
            </button>
          </div>
          {validationErrors.newPassword && (
            <div className="validation-error">{validationErrors.newPassword}</div>
          )}
          <div className="password-requirements">
            <p>Mật khẩu phải có ít nhất:</p>
            <ul>
              <li className={passwordData.newPassword.length >= 8 ? "met" : ""}>8 ký tự</li>
              <li className={/[A-Z]/.test(passwordData.newPassword) ? "met" : ""}>1 chữ cái hoa</li>
              <li className={/[a-z]/.test(passwordData.newPassword) ? "met" : ""}>1 chữ cái thường</li>
              <li className={/[0-9]/.test(passwordData.newPassword) ? "met" : ""}>1 chữ số</li>
              <li className={/[^A-Za-z0-9]/.test(passwordData.newPassword) ? "met" : ""}>1 ký tự đặc biệt</li>
            </ul>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
          <div className="password-input-container">
            <input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              className={validationErrors.confirmPassword ? "error" : ""}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              <img 
                src={passwordVisibility.confirmPassword ? eyeOnIcon : eyeOffIcon} 
                alt={passwordVisibility.confirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} 
                className="eye-icon"
              />
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <div className="validation-error">{validationErrors.confirmPassword}</div>
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword; 