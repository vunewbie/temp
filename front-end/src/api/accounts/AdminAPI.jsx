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
    let response;
    // formdata is less efficient than JSON, so we use JSON when there is no file upload
    if (adminData instanceof FormData) {
      response = await axios.patch(`${API_URL}/accounts/admins/${adminId}`, adminData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {      
      // process data before sending, ensure empty strings ('') are converted to null
      const processedData = JSON.parse(JSON.stringify(adminData));

      Object.keys(processedData).forEach(key => {
        if (processedData[key] === '') {
          processedData[key] = null;
        }
      });
      
      response = await axios.patch(`${API_URL}/accounts/admins/${adminId}`, processedData, {
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