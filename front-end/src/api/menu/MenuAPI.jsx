import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_API;

// Get list of menu items
export const listMenuItemsAPI = async (filters = {}) => {
  try {
    // Prepare parameters for request
    const params = {};
    
    // Add filters to params
    if (filters.branch) {
      params.branch = filters.branch;
    }
    
    if (filters.category) {
      params.category = filters.category;
    }
    
    const response = await axios.get(`${API_URL}/menu/menus`, {
      params
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách menu:", error);
    throw error;
  }
};

// Get detailed information about a menu item
export const getMenuItemAPI = async (menuId) => {
  try {
    const response = await axios.get(`${API_URL}/menu/menus/${menuId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin menu với ID ${menuId}:`, error);
    throw error;
  }
};

// Add a menu item
export const addMenuItemAPI = async (menuData) => {
  try {
    const response = await axios.post(`${API_URL}/menu/menus`, menuData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm món ăn vào menu:", error);
    throw error;
  }
};

// Update the information of a menu item
export const updateMenuItemAPI = async (menuId, menuData) => {
  try {
    const response = await axios.patch(`${API_URL}/menu/menus/${menuId}`, menuData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật thông tin menu với ID ${menuId}:`, error);
    throw error;
  }
};
