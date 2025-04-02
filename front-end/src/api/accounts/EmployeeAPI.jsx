import axios from "axios";
import { translateErrorMessage } from '../../utils';

const API_URL = import.meta.env.VITE_BACKEND_API;

// retrieve employee info
export const retrieveEmployeeInfoAPI = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/employees/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên:", error);
    throw error;
  }
};

// update employee info
export const updateEmployeeInfoAPI = async (employeeId, employeeData) => {  
  try {
    let response;
    
    if (employeeData instanceof FormData) {
      console.log("EmployeeAPI: Gửi request với FormData");
      
      // Log FormData để kiểm tra
      for (let pair of employeeData.entries()) {
        console.log(pair[0] + ":", pair[1] instanceof File ? 'File' : pair[1]);
      }
      
      // DRF handles fields in formdata as { "user.field": value }
      response = await axios.patch(`${API_URL}/accounts/employees/${employeeId}`, employeeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      console.log("EmployeeAPI: Gửi request với JSON data:", JSON.stringify(employeeData));
      
      // Vì backend đang mong đợi format là { "user.field": value } thay vì { user: { field: value } }
      // nên cần chuyển đổi dữ liệu JSON
      const formattedData = {};
      
      if (employeeData.user && typeof employeeData.user === 'object') {
        Object.keys(employeeData.user).forEach(field => {
          const value = employeeData.user[field];
          formattedData[`user.${field}`] = value === '' ? null : value;
        });
      }
      
      // Thêm các trường khác không thuộc về user
      Object.keys(employeeData).forEach(key => {
        if (key !== 'user') {
          formattedData[key] = employeeData[key] === '' ? null : employeeData[key];
        }
      });
      
      console.log("EmployeeAPI: Dữ liệu đã format:", formattedData);
      response = await axios.patch(`${API_URL}/accounts/employees/${employeeId}`, formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log("EmployeeAPI: Nhận phản hồi thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin nhân viên:", error);
    
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

// list employee info
export const listEmployeeInfoAPI = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/accounts/employees`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      params: filters
    });
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên:", error);
    throw error;
  }
};

// fire employee
export const fireEmployeeAPI = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/accounts/employees/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi sa thải nhân viên:", error);
    throw error;
  }
};

// create employee
export const createEmployeeAPI = async (employeeData) => {
  try {
    // Check if employeeData is FormData
    if (!(employeeData instanceof FormData)) {
      throw new Error("Dữ liệu phải được gửi dưới dạng FormData để hỗ trợ tải lên avatar");
    }
    
    const response = await axios.post(`${API_URL}/accounts/employees`, employeeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error);
    
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
      } else if (error.response.status === 403) {
        console.error("Không có quyền thực hiện hành động này");
      }
    }
    
    throw error;
  }
};