import React, { useState, useEffect } from 'react';
import { listDishAPI, deleteDishAPI } from '../../../api';
import { updateIcon, deleteIcon, defaultAvatar } from '../../../assets';
import { DishPopupWindow } from '../../../components';
import './Dish.css';

const Dish = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDishPopup, setShowDishPopup] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch dishes and categories when component mounts
  useEffect(() => {
    fetchDishes();
  }, []);

  // Fetch dishes when selected category or status changes
  useEffect(() => {
    fetchDishes();
  }, [selectedCategory, statusFilter]);

  // Function to format image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultAvatar;
    
    // If image already has http/https, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If image is a relative path, construct full URL
    const baseUrl = import.meta.env.VITE_BACKEND_API.split('/api')[0];
    return `${baseUrl}${imagePath}`;
  };

  // Function to fetch dishes from API
  const fetchDishes = async () => {
    try {
      setLoading(true);
      
      // Get dishes data
      const data = await listDishAPI();
      
      // If there are dishes, extract categories
      if (data && data.length > 0) {
        // Create a set of unique category IDs
        const uniqueCategoryIds = new Set();
        const categoryList = [];
        
        // Build category list and filter dishes by category if selected
        let filteredDishes = data;
        
        data.forEach(dish => {
          if (dish.category && !uniqueCategoryIds.has(dish.category)) {
            uniqueCategoryIds.add(dish.category);
            categoryList.push({ id: dish.category, name: dish.category_name });
          }
        });
        
        // If a category is selected, filter dishes
        if (selectedCategory) {
          filteredDishes = filteredDishes.filter(dish => dish.category === parseInt(selectedCategory));
        }
        
        // Filter by status if needed
        if (statusFilter !== 'all') {
          const isActive = statusFilter === 'active';
          filteredDishes = filteredDishes.filter(dish => dish.status === isActive);
        }
        
        setCategories(categoryList);
        setDishes(filteredDishes);
      } else {
        setDishes([]);
      }
      
      setError('');
    } catch (err) {
      console.error('Lỗi khi lấy danh sách món ăn:', err);
      setError('Không thể lấy danh sách món ăn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle category selection change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  // Function to handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Function to handle dish update click
  const handleUpdateClick = (dishId) => {
    setSelectedDishId(dishId);
    setShowDishPopup(true);
  };

  // Function to handle dish deletion click
  const handleDeleteClick = (dishId, dishName) => {
    setDishToDelete({ id: dishId, name: dishName });
    setConfirmDelete(true);
  };

  // Function to confirm deletion
  const handleConfirmDelete = async () => {
    if (!dishToDelete) return;
    
    try {
      setLoading(true);
      await deleteDishAPI(dishToDelete.id);
      setSuccessMessage(`Đã xóa món ăn ${dishToDelete.name} thành công`);
      
      // Remove the deleted dish from the list
      setDishes(prevDishes => prevDishes.filter(dish => dish.id !== dishToDelete.id));
      
      // Close confirmation dialog
      setConfirmDelete(false);
      setDishToDelete(null);
    } catch (err) {
      console.error('Lỗi khi xóa món ăn:', err);
      setError('Không thể xóa món ăn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setDishToDelete(null);
  };

  // Function to close dish popup
  const handleCloseDishPopup = () => {
    setShowDishPopup(false);
    setSelectedDishId(null);
    // Refresh dish data
    fetchDishes();
  };
  
  // Function to render dish status
  const renderStatus = (status) => {
    return status ? (
      <span className="status-active">Đang bán</span>
    ) : (
      <span className="status-inactive">Ngừng bán</span>
    );
  };

  // Show loading state
  if (loading && dishes.length === 0) {
    return (
      <div className="dish-management-container">
        <h2>Quản lý món ăn</h2>
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="dish-management-container">
      <h2>Quản lý món ăn</h2>
      
      {/* Success message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button 
            className="close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
          <button 
            className="close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter container */}
      <div className="filter-container">
        <div className="filter-content">
          {/* Category filter */}
          <div className="filter-item">
            <label htmlFor="category-filter">Lọc theo danh mục:</label>
            <select 
              id="category-filter" 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              className="category-select"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status filter */}
          <div className="filter-item">
            <label htmlFor="status-filter">Trạng thái:</label>
            <select 
              id="status-filter" 
              value={statusFilter} 
              onChange={handleStatusFilterChange}
              className="status-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang Bán</option>
              <option value="inactive">Ngừng Bán</option>
            </select>
          </div>
          
          {/* Clear filter button */}
          {(selectedCategory || statusFilter !== 'all') && (
            <button 
              className="clear-filter-button"
              onClick={() => {
                setSelectedCategory('');
                setStatusFilter('all');
              }}
              title="Xóa bộ lọc"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Dishes table */}
      <div className="dishes-table-container">
        <table className="dishes-table">
          <thead>
            <tr>
              <th className="image-header">Hình ảnh</th>
              <th>Tên món</th>
              <th>Giá</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {dishes.length > 0 ? (
              dishes.map((dish) => (
                <tr key={dish.id} className={!dish.status ? 'inactive' : ''}>
                  <td className="image-cell">
                    <img 
                      src={getImageUrl(dish.image)} 
                      alt={dish.name} 
                      className="dish-image"
                    />
                  </td>
                  <td>{dish.name}</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dish.price)}</td>
                  <td>{dish.category_name || 'Chưa phân loại'}</td>
                  <td>{renderStatus(dish.status)}</td>
                  <td className="action-cell">
                    <button 
                      className="icon-button update-button"
                      onClick={() => handleUpdateClick(dish.id)}
                      title="Cập nhật thông tin"
                    >
                      <img src={updateIcon} alt="Cập nhật" />
                    </button>
                    <button 
                      className="icon-button delete-button"
                      onClick={() => handleDeleteClick(dish.id, dish.name)}
                      title="Xóa món ăn"
                    >
                      <img src={deleteIcon} alt="Xóa" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-table">
                  {loading ? 'Đang tải dữ liệu...' : 'Không có món ăn nào'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && dishToDelete && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa món ăn <strong>{dishToDelete.name}</strong>?</p>
            <div className="button-container">
              <button 
                className="confirm-button"
                onClick={handleConfirmDelete}
              >
                Xóa
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dish popup */}
      {showDishPopup && (
        <div className="modal-overlay">
          <DishPopupWindow 
            dishId={selectedDishId}
            onClose={handleCloseDishPopup}
          />
        </div>
      )}
    </div>
  );
};

export default Dish; 