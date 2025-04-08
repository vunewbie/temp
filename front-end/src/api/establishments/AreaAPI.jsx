import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API;

// list area info
export const listAreaInfoAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/establishments/areas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khu vực:", error);
    throw error;
  }
};

// update area info
export const updateAreaInfoAPI = async (areaId, areaData) => {
  try {
    const response = await axios.patch(`${API_URL}/establishments/areas/${areaId}`, areaData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin khu vực:", error);
    throw error;
  }
};

// create area
export const createAreaAPI = async (areaData) => {
  try {
    const response = await axios.post(`${API_URL}/establishments/areas`, areaData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo khu vực:", error);
    throw error;
  }
};
