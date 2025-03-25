import axios from "axios";
import { translateErrorMessage } from '../../utils';

const API_URL = import.meta.env.VITE_BACKEND_API;

// retrieve manager info
export const retrieveManagerInfoAPI = async (managerId) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/managers/${managerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin quản lý:", error);
    throw error;
  }
};

// update manager info
export const updateManagerInfoAPI = async (managerId, managerData) => {  
  try {
    let response;
    
    if (managerData instanceof FormData) {
      // DRF handles fields in formdata as { "user.field": value }
      response = await axios.patch(`${API_URL}/accounts/managers/${managerId}`, managerData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      // DRF handles JSON data as { "user.field": value } so we need to convert it
      // to be consistent with the format of formdata
      const processedData = JSON.parse(JSON.stringify(managerData));
      
      // convert data from { user: { field: value } } to { "user.field": value }
      const formattedData = {};
      
      if (processedData.user && typeof processedData.user === 'object') {
        Object.keys(processedData.user).forEach(field => {
          const value = processedData.user[field];
          formattedData[`user.${field}`] = value === '' ? null : value;
        });
      }
      
      // add fields that are not user fields
      Object.keys(processedData).forEach(key => {
        if (key !== 'user') {
          formattedData[key] = processedData[key] === '' ? null : processedData[key];
        }
      });
      
      response = await axios.patch(`${API_URL}/accounts/managers/${managerId}`, formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin quản lý:", error);
    
    if (error.response) {
      console.error("Server error:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data) {
        const errorData = error.response.data;
        if (errorData.user) {
          // translate error message
          Object.keys(errorData.user).forEach(field => {
            errorData.user[field] = errorData.user[field].map(err => translateErrorMessage(err));
            console.error(`Lỗi ${field}:`, errorData.user[field]);
          });
        } else {
          // translate error message
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
