import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API;

// list dish
export const listDishAPI = async () => {
  const response = await axios.get(`${API_URL}/menu/dishes`);
  return response.data;
};

// update dish
export const updateDishAPI = async (dishId, dishData) => {
  try {
    const response = await axios.patch(`${API_URL}/menu/dishes/${dishId}/update`, dishData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin món ăn:", error);
    throw error;
  }
};

// create dish
export const createDishAPI = async (dishData) => {
  try {
    const response = await axios.post(`${API_URL}/menu/dishes/create`, dishData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo món ăn:", error);
    throw error;
  }
};

// delete dish
export const deleteDishAPI = async (dishId) => {
  try {
    const response = await axios.delete(`${API_URL}/menu/dishes/${dishId}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error);
    throw error;
  }
};

