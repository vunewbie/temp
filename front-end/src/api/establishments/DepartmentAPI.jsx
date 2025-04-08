import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API;

// list department info
export const listDepartmentInfoAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/establishments/departments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng ban:", error);
    throw error;
  }
};

// update department info
export const updateDepartmentInfoAPI = async (departmentId, departmentData) => {
  try {
    const response = await axios.patch(`${API_URL}/establishments/departments/${departmentId}`, departmentData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin phòng ban:", error);
    throw error;
  }
};

// create department
export const createDepartmentAPI = async (departmentData) => {
  try {
    const response = await axios.post(`${API_URL}/establishments/departments`, departmentData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo phòng ban:", error);
    throw error;
  }
};
