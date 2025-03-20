import axios from "axios";
import { translateErrorMessage } from '../utils/errorTranslator';

const API_URL = import.meta.env.VITE_BACKEND_API;

// Retrieve customer info
export const retrieveCustomerInfoAPI = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      /* CORS settings */
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
    throw error;
  }
};

// Update customer info
export const updateCustomerInfoAPI = async (customerId, customerData) => {  
  try {
    let response;
    // Formdata is less efficient than JSON, so we use JSON when there is no file upload
    if (customerData instanceof FormData) {
      response = await axios.patch(`${API_URL}/accounts/customers/${customerId}`, customerData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
    } else {      
      // Process data before sending, ensure empty strings ('') are converted to null
      const processedData = JSON.parse(JSON.stringify(customerData));
      
      // data is nested("user" : {...}) -> turn fields into null if its value is ''
      const processNestedObject = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        
        Object.keys(obj).forEach(key => {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            processNestedObject(obj[key]);
          } else if (obj[key] === '') {
            obj[key] = null;
          }
        });
      };
      
      processNestedObject(processedData);
      
      response = await axios.patch(`${API_URL}/accounts/customers/${customerId}`, processedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
    }
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin khách hàng:", error);
    
    if (error.response) {
      console.error("Server error:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data) {
        const errorData = error.response.data;
        if (errorData.user) {
          // errorData.user is an object, so we need to iterate over its keys
          Object.keys(errorData.user).forEach(field => {
            const translatedErrors = errorData.user[field].map(err => translateErrorMessage(err));
            console.error(`Lỗi ${field}:`, translatedErrors);
          });
        } else {
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              const translatedErrors = errorData[field].map(err => translateErrorMessage(err));
              console.error(`Lỗi ${field}:`, translatedErrors);
            }
          });
        }
      }
    
      if (error.response.status === 401) {
        console.error("Token hết hạn hoặc không hợp lệ");
      }
    } else if (error.request) {
      console.error("Không nhận được phản hồi từ server:", error.request);
    } else {
      console.error("Lỗi khi thiết lập request:", error.message);
    }
    
    throw error;
  }
}; 