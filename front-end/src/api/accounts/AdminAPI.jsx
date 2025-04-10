import axios from "axios";
import { translateErrorMessage } from '../../utils';

const API_URL = import.meta.env.VITE_BACKEND_API;

// retrieve admin info
export const retrieveAdminInfoAPI = async (adminId) => {
    try {
      const response = await axios.get(`${API_URL}/accounts/admins/${adminId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}`}
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin quản trị viên:", error);
      throw error;
    }
  };
  
// update admin info
export const updateAdminInfoAPI = async (adminId, adminData) => {  
  try {
    console.log('AdminAPI: Gửi request đến adminId:', adminId);
    
    let response;
    
    if (adminData instanceof FormData) {
      // FormData is prepared correctly from UserInfo.jsx, send directly
      response = await axios.patch(`${API_URL}/accounts/admins/${adminId}`, adminData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {      
      // Because backend expects format { "user.field": value } instead of { user: { field: value } }
      // so we need to convert the data
      const formattedData = {};
      
      if (adminData.user && typeof adminData.user === 'object') {
        Object.keys(adminData.user).forEach(field => {
          const value = adminData.user[field];
          formattedData[`user.${field}`] = value === '' ? null : value;
        });
      }
      
      // Add other fields that are not part of user
      Object.keys(adminData).forEach(key => {
        if (key !== 'user') {
          formattedData[key] = adminData[key] === '' ? null : adminData[key];
        }
      });
      
      response = await axios.patch(`${API_URL}/accounts/admins/${adminId}`, formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin quản trị viên:", error);
    
    if (error.response) {
      console.error("Server error:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
      
      // handle errors
      if (error.response.data) {
        const errorData = error.response.data;
        if (errorData.user) {
          Object.keys(errorData.user).forEach(field => {
            errorData.user[field] = errorData.user[field].map(err => translateErrorMessage(err));
            console.error(`Lỗi ${field}:`, errorData.user[field]);
          });
        } else {
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              errorData[field] = errorData[field].map(err => translateErrorMessage(err));
              console.error(`Lỗi ${field}:`, errorData[field]);
            }
          });
        }
      }
    
      if (error.response.status === 401) {
        console.error("Token hết hạn hoặc không hợp lệ");
      }
    }
    
    throw error;
  }
}; 