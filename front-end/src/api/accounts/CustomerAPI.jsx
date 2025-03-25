import axios from "axios";
import { translateErrorMessage } from '../../utils';

const API_URL = import.meta.env.VITE_BACKEND_API;

// retrieve customer info
export const retrieveCustomerInfoAPI = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
    throw error;
  }
};

// update customer info
export const updateCustomerInfoAPI = async (customerId, customerData) => {  
  try {
    let response;

    if (customerData instanceof FormData) {
      response = await axios.patch(`${API_URL}/accounts/customers/${customerId}`, customerData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {      
      const processedData = JSON.parse(JSON.stringify(customerData));
      
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
        }
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
            errorData.user[field] = errorData.user[field].map(err => translateErrorMessage(err));
            console.error(`Lỗi ${field}:`, errorData.user[field]);
          });
        } else {
          // errors that are not user info errors
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

