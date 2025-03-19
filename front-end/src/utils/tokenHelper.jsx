import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Biến để lưu trữ các interceptors ids
let requestInterceptorId = null;
let responseInterceptorId = null;

export const decodeToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken;
    } catch (error) {
        console.error("Lỗi khi decode token: ", error);
        return null;
    }
}

export const isExpiredToken = (decodedToken) => {
    if (!decodedToken) return true;
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}

export const checkAccessToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;
    
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    return !isExpiredToken(decoded);
};

export const getUserFromToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    
    const decoded = decodeToken(token);
    if (!decoded) return null;
    
    return {
        id: decoded.user_id,
        username: decoded.username,
        type: decoded.type
    };
};

// Xóa các interceptors hiện tại nếu có
export const removeAxiosInterceptors = () => {
    if (requestInterceptorId !== null) {
        axios.interceptors.request.eject(requestInterceptorId);
        requestInterceptorId = null;
    }
    
    if (responseInterceptorId !== null) {
        axios.interceptors.response.eject(responseInterceptorId);
        responseInterceptorId = null;
    }
};

export const setupAxiosInterceptors = (refreshTokenFn) => {
    // Xóa các interceptors cũ trước khi thiết lập cái mới
    removeAxiosInterceptors();
    
    // Kiểm tra nếu refreshTokenFn không phải là hàm
    if (typeof refreshTokenFn !== 'function') {
        console.error('setupAxiosInterceptors: refreshTokenFn không phải là hàm. Interceptors sẽ không có khả năng refresh token.');
    }
    
    // Request interceptor
    requestInterceptorId = axios.interceptors.request.use(
        async (config) => {
            // these urls don't need to be intercepted
            if (config.url?.includes('/token/refresh') || 
                config.url?.includes('/login') || 
                config.url?.includes('/register')) {
                return config;
            }
            
            let accessToken = localStorage.getItem("access_token");
            
            if (accessToken) {
                // refresh token if expired
                const decoded = decodeToken(accessToken);
                if (decoded && isExpiredToken(decoded) && typeof refreshTokenFn === 'function') {
                    try {
                        const response = await refreshTokenFn();
                        accessToken = response.data.access;
                    } catch (error) {
                        console.error('Lỗi khi refresh token:', error);
                        window.dispatchEvent(new Event("auth_error"));
                        return Promise.reject(error);
                    }
                }
                // add authorization header
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            
            return config;
        },
        (error) => Promise.reject(error)
    );
    
    // Response interceptor
    responseInterceptorId = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            
            if (error.response?.status === 401 && !originalRequest._retry && typeof refreshTokenFn === 'function') {
                // avoid requesting refresh token multiple times
                originalRequest._retry = true;
                
                try {
                    const response = await refreshTokenFn();
                    
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    
                    return axios(originalRequest);
                } catch (refreshError) {
                    console.error('Lỗi khi refresh token trong response interceptor:', refreshError);
                    window.dispatchEvent(new Event("auth_error"));
                    return Promise.reject(refreshError);
                }
            }
            
            return Promise.reject(error);
        }
    );
    
    return { requestInterceptorId, responseInterceptorId };
};





