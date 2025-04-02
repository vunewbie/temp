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
      console.log("ManagerAPI: Gửi request với FormData");
      
      // Log FormData để kiểm tra
      for (let pair of managerData.entries()) {
        console.log(pair[0] + ":", pair[1] instanceof File ? 'File' : pair[1]);
      }
      
      // DRF handles fields in formdata as { "user.field": value }
      response = await axios.patch(`${API_URL}/accounts/managers/${managerId}`, managerData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      console.log("ManagerAPI: Gửi request với JSON data:", JSON.stringify(managerData));
      
      // Vì backend đang mong đợi format là { "user.field": value } thay vì { user: { field: value } }
      // nên cần chuyển đổi dữ liệu JSON
      const formattedData = {};
      
      if (managerData.user && typeof managerData.user === 'object') {
        Object.keys(managerData.user).forEach(field => {
          const value = managerData.user[field];
          formattedData[`user.${field}`] = value === '' ? null : value;
        });
      }
      
      // Thêm các trường khác không thuộc về user
      Object.keys(managerData).forEach(key => {
        if (key !== 'user') {
          formattedData[key] = managerData[key] === '' ? null : managerData[key];
        }
      });
      
      console.log("ManagerAPI: Dữ liệu đã format:", formattedData);
      response = await axios.patch(`${API_URL}/accounts/managers/${managerId}`, formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log("ManagerAPI: Nhận phản hồi thành công:", response.data);
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

// list manager info
export const ListManagerInfoAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/accounts/managers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách quản lý:", error);
    throw error;
  }
};

// fire manager
export const fireManagerAPI = async (managerId) => {
  try {
    const response = await axios.delete(`${API_URL}/accounts/managers/${managerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi sa thải quản lý:", error);
    throw error;
  }
};

// create manager
export const createManagerAPI = async (managerData) => {
  try {
    const response = await axios.post(`${API_URL}/accounts/managers`, managerData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo quản lý:", error);
    throw error;
  }
};
