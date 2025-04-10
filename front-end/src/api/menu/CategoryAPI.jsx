import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API;

// list category
export const listCategoryAPI = async () => {
  const response = await axios.get(`${API_URL}/menu/categories`);
  return response.data;
};

// update category
export const updateCategoryAPI = async (categoryId, categoryData) => {
    try {
        const response = await axios.patch(`${API_URL}/menu/categories/${categoryId}/update`, categoryData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
    
        return response.data;
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin danh mục:", error);
        throw error;
      }
};

// create category
export const createCategoryAPI = async (categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/menu/categories/create`, categoryData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
    
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo danh mục:", error);
        throw error;
    }
};

// delete category
export const deleteCategoryAPI = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/menu/categories/${categoryId}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    throw error;
  }
};
