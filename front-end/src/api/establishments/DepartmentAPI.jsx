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
