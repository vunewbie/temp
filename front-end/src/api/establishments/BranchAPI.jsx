import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API;

// list branch info
export const listBranchInfoAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/establishments/branches`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chi nhánh:", error);
    throw error;
  }
};
