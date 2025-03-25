import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAccessToken, getUserFromToken } from '../utils';
import { 
  normalLoginAPI, 
  logoutAPI, 
  refreshTokenAPI,
  googleLoginAPI,
  facebookLoginAPI,
  gitHubLoginAPI
} from '../api';

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

  // normal login api call and local storage
  const login = async (username, password) => {
    try {
      const response = await normalLoginAPI(username, password);
      
      // save token to local storage
      if (response.data) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // update state
      setIsAuthenticated(true);
      const userData = getUserFromToken();
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // logout - manage api call and local storage
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // only call logout api if there is refresh token
      if (refreshToken) {
        try {
          await logoutAPI(refreshToken);
        } catch (apiError) {
          console.error('Lỗi khi gọi API đăng xuất:', apiError);
        }
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      // always clear login data from local storage, regardless of error
      clearAuthData();
      
      // redirect to login page
      navigate('/login');
    }
  };

  // refresh token
  const refreshToken = async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refresh_token');
      if (!currentRefreshToken) {
        throw new Error('Không có refresh token');
      }
      
      const response = await refreshTokenAPI(currentRefreshToken);
      
      // save new token
      localStorage.setItem('access_token', response.data.access);
      
      return response;
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
      // clear auth data if cannot refresh token
      clearAuthData();
      throw error;
    }
  };

  // clear auth data
  const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    setUser(null);
  };

  // update user info from token
  const updateUser = () => {
    const userData = getUserFromToken();
    if (userData) {
      setUser(userData);
    }
  };

  // listen to auth error event
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

  // check token when component mount
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

  // handle google login
  const handleGoogleLogin = async (code) => {
    try {
      const response = await googleLoginAPI(code);
      
      // save token to local storage
      if (response.data) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // update state
      setIsAuthenticated(true);
      const userData = getUserFromToken();
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // handle facebook login
  const handleFacebookLogin = async (code) => {
    try {
      const response = await facebookLoginAPI(code);
      
      // save token to local storage
      if (response.data) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // update state
      setIsAuthenticated(true);
      const userData = getUserFromToken();
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // handle github login
  const handleGitHubLogin = async (code) => {
    try {
      const response = await gitHubLoginAPI(code);
      
      // save token to local storage
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