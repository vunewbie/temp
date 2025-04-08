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

// update branch info
export const updateBranchInfoAPI = async (branchId, branchData) => {
  try {
    const response = await axios.patch(`${API_URL}/establishments/branches/${branchId}`, branchData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin chi nhánh:", error);
    throw error;
  }
};

// create branch
export const createBranchAPI = async (branchData) => {
  try {
    const response = await axios.post(`${API_URL}/establishments/branches`, branchData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo chi nhánh:", error);
    throw error;
  }
};
