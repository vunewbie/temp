import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAccessToken, getUserFromToken, setupAxiosInterceptors } from '../utils/tokenHelper';
import { 
  normalLogin, 
  logoutAPI, 
  refreshTokenAPI,
  googleLogin,
  facebookLogin,
  gitHubLogin
} from '../api/Auths';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true' && checkAccessToken();
  });
  
  const [user, setUser] = useState(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      return getUserFromToken();
    }
    return null;
  });
  
  const navigate = useNavigate();

  // Thiết lập axios interceptors khi context được khởi tạo
  useEffect(() => {
    // Bỏ comment dòng dưới nếu bạn muốn di chuyển việc thiết lập interceptors từ main.jsx sang đây
    // setupAxiosInterceptors(refreshToken);
  }, []);

  // Đăng nhập - quản lý API call và localStorage
  const login = async (username, password) => {
    try {
      const response = await normalLogin(username, password);
      
      // Lưu token vào localStorage
      if (response.data) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // Cập nhật trạng thái
      setIsAuthenticated(true);
      const userData = getUserFromToken();
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Đăng xuất - quản lý API call và localStorage
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Chỉ gọi API logout nếu có refresh token
      if (refreshToken) {
        try {
          await logoutAPI(refreshToken);
        } catch (apiError) {
          console.error('Lỗi khi gọi API đăng xuất:', apiError);
          // Tiếp tục thực hiện đăng xuất dù API có lỗi
        }
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      // Luôn xóa dữ liệu đăng nhập khỏi localStorage, bất kể có lỗi hay không
      clearAuthData();
      
      // Chuyển hướng về trang đăng nhập
      navigate('/login');
    }
  };

  // Làm mới token
  const refreshToken = async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refresh_token');
      if (!currentRefreshToken) {
        throw new Error('Không có refresh token');
      }
      
      const response = await refreshTokenAPI(currentRefreshToken);
      
      // Lưu token mới
      localStorage.setItem('access_token', response.data.access);
      
      return response;
    } catch (error) {
      // Xóa dữ liệu xác thực nếu không thể làm mới token
      clearAuthData();
      throw error;
    }
  };

  // Hàm tiện ích để xóa dữ liệu xác thực
  const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Cập nhật thông tin user
  const updateUser = () => {
    const userData = getUserFromToken();
    if (userData) {
      setUser(userData);
    }
  };

  // Lắng nghe sự kiện lỗi xác thực
  useEffect(() => {
    const handleAuthError = () => {
      clearAuthData();
      navigate('/login');
    };

    window.addEventListener('auth_error', handleAuthError);
    
    return () => {
      window.removeEventListener('auth_error', handleAuthError);
    };
  }, [navigate]);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const checkAuth = () => {
      const isValid = checkAccessToken();
      if (!isValid) {
        clearAuthData();
      } else if (!user) {
        updateUser();
      }
    };

    checkAuth();
  }, []);

  // Xử lý đăng nhập bằng Google OAuth2
  const handleGoogleLogin = async (code) => {
    try {
      const response = await googleLogin(code);
      
      // Lưu token vào localStorage
      if (response.data) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // Cập nhật trạng thái
      setIsAuthenticated(true);
      const userData = getUserFromToken();
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Xử lý đăng nhập bằng Facebook OAuth2
  const handleFacebookLogin = async (code) => {
    try {
      const response = await facebookLogin(code);
      
      // Lưu token vào localStorage
      if (response.data) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // Cập nhật trạng thái
      setIsAuthenticated(true);
      const userData = getUserFromToken();
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Xử lý đăng nhập bằng GitHub OAuth2
  const handleGitHubLogin = async (code) => {
    try {
      const response = await gitHubLogin(code);
      
      // Lưu token vào localStorage
      if (response.data) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // Cập nhật trạng thái
      setIsAuthenticated(true);
      const userData = getUserFromToken();
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    refreshToken,
    updateUser,
    handleGoogleLogin,
    handleFacebookLogin,
    handleGitHubLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 