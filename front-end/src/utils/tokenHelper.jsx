import { jwtDecode } from "jwt-decode";
import axios from "axios";

// interceptors ids
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

// remove current interceptors if exist
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
    // remove current interceptors before setting up new ones
    removeAxiosInterceptors();
    
    // check if refreshTokenFn is not a function
    if (typeof refreshTokenFn !== 'function') {
        console.error('setupAxiosInterceptors: refreshTokenFn is not a function. Interceptors will not be able to refresh token.');
    }
    
    // request interceptor
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
                        // use refresh token from localStorage to refresh token
                        const refreshToken = localStorage.getItem("refresh_token");
                        if (!refreshToken) {
                            throw new Error('Không có refresh token trong localStorage');
                        }
                        
                        const response = await refreshTokenFn(refreshToken);
                        accessToken = response.data.access;
                        localStorage.setItem('access_token', accessToken);
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
    
    // response interceptor
    responseInterceptorId = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            
            if (error.response?.status === 401 && !originalRequest._retry && typeof refreshTokenFn === 'function') {
                // avoid requesting refresh token multiple times
                originalRequest._retry = true;
                
                try {
                    // use refresh token from localStorage to refresh token
                    const refreshToken = localStorage.getItem("refresh_token");
                    if (!refreshToken) {
                        throw new Error('Không có refresh token trong localStorage');
                    }
                    
                    const response = await refreshTokenFn(refreshToken);
                    
                    const newAccessToken = response.data.access;
                    localStorage.setItem('access_token', newAccessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    
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





