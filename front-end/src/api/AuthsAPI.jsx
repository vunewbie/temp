import axios from "axios";
import { translateErrorMessage } from "../utils/errorTranslator";

const API_URL = import.meta.env.VITE_BACKEND_API;

// normal login
export const normalLoginAPI = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/token`, { username, password });
        return response;
    } catch (error) {
        throw error;
    }
};

// Customer Register
export const customerRegisterAPI = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/customers`, {
            user: { username, email, password }
        });

        return response;
    } catch (error) {
        if (error.response) {
            // server error
            const serverError = error.response.data;
            let errorMessage = 'Đã xảy ra lỗi khi đăng ký';
            
            // check server error
            if (serverError.user) {
                // user info errors
                if (serverError.user.username) {
                    errorMessage = translateErrorMessage(serverError.user.username[0]);
                } else if (serverError.user.email) {
                    errorMessage = translateErrorMessage(serverError.user.email[0]);
                } else if (serverError.user.password) {
                    errorMessage = translateErrorMessage(serverError.user.password[0]);
                }
            } else if (serverError.message) {
                errorMessage = translateErrorMessage(serverError.message);
            }
            
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error(translateErrorMessage('Unable to connect to server'));
        } else {
            throw new Error(translateErrorMessage('An error occurred during registration'));
        }
    }
};

// Register Verify OTP
export const registerVerifyOTPAPI = async (hashedEmail, otpCode) => {
  try {
    const response = await axios.post(
      `${API_URL}/accounts/verify-otp/register`,
       { hashed_email: hashedEmail, otp_code: otpCode }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

// Resend Register OTP
export const resendRegisterOTPAPI = async (hashedEmail) => {
    try {
        const response = await axios.post(
            `${API_URL}/accounts/resend-otp/register`,
             { hashed_email: hashedEmail }
        );

        return response;
    } catch (error) {
        throw error;
    }
};

// Forgot Password
export const forgotPasswordAPI = async (usernameOrEmail) => {
    try {
        const response = await axios.post(
            `${API_URL}/accounts/forgot-password`,
             { username_or_email: usernameOrEmail }
        );

        return response;
    } catch (error) {
        throw error;
    }
}

// Forgot Password Verify OTP
export const forgotPasswordVerifyOTPAPI = async (username, otpCode) => {
    try {
        const response = await axios.post(
            `${API_URL}/accounts/verify-otp/forgot-password`,
             {username: username, otp_code: otpCode}
        );

        return response;
    } catch (error) {
        throw error;
    }
}

// Resend Forgot Password OTP
export const resendForgotPasswordOTPAPI = async (username) => {
    try {
        const response = await axios.post(
            `${API_URL}/accounts/resend-otp/forgot-password`,
             { username: username }
        );

        return response;
    } catch (error) {
        throw error;
    }
}

// Reset Password
export const resetPasswordAPI = async (resetToken, newPassword) => {
    try {
        const response = await axios.post(
            `${API_URL}/accounts/reset-password`,
             { reset_token: resetToken, new_password: newPassword }
        );
        
        return response;
    } catch (error) {
        throw error;
    }
}

// Google OAuth2
export const getGoogleOAuth2CodeAPI = () => {
    try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
        const scope = import.meta.env.VITE_GOOGLE_SCOPE;

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
        window.location.href = authUrl;
    } catch (error) {
        throw error;
    }
};

export const googleLoginAPI = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/auth/google/login/`, { code });
    return response;
  } catch (error) {
    throw error;
  }
};

// Facebook OAuth2
export const getFacebookOAuth2CodeAPI = () => {
    try {
        const clientId = import.meta.env.VITE_FACEBOOK_APP_ID;
        const redirectUri = import.meta.env.VITE_FACEBOOK_REDIRECT_URI;
        const scope = import.meta.env.VITE_FACEBOOK_SCOPE;

        const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
        window.location.href = authUrl;
    } catch (error) {
        throw error;
    }
};

export const facebookLoginAPI = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/auth/facebook/login/`, { code });
    return response;
  } catch (error) {
    throw error;
  }
};

// GitHub OAuth2
export const getGitHubOAuth2CodeAPI = () => {
    try {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;
        const scope = import.meta.env.VITE_GITHUB_SCOPE;

        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        window.location.href = authUrl;
    } catch (error) {
        throw error;
    }
};

export const gitHubLoginAPI = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/auth/github/login/`, { code });
    return response;
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutAPI = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/log-out`, {
            refresh: refreshToken
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Refresh Token
export const refreshTokenAPI = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/token/refresh`, {
            refresh: refreshToken
        }, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi refresh token:", error);
        throw error;
    }
}

// Change Password
export const changePasswordAPI = async (oldPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}/accounts/change-password/`,
       { old_password: oldPassword, new_password: newPassword },
       { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`}, 
       withCredentials: true
    });
    
    return response;
  } catch (error) {
    throw error;
  }
}; 