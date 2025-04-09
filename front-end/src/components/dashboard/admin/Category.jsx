import React, { useState, useEffect } from 'react';
import { listCategoryAPI, updateCategoryAPI, deleteCategoryAPI } from '../../../api/menu/CategoryAPI';
import { categoryItemIcon, deleteIcon } from '../../../assets';
import './Category.css';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editedCategories, setEditedCategories] = useState({});

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await listCategoryAPI();
      setCategories(data);
      setError('');
    } catch (err) {
      console.error('Lỗi khi lấy danh sách danh mục:', err);
      setError('Không thể lấy danh sách danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle editing mode
  const handleEditToggle = () => {
    if (isEditing) {
      // If we're currently editing, exit edit mode and reset any changes
      setIsEditing(false);
      setEditedCategories({});
    } else {
      // If we're not editing, enter edit mode and initialize the edited categories object
      const initialEdits = {};
      categories.forEach(category => {
        initialEdits[category.id] = category.name;
      });
      setEditedCategories(initialEdits);
      setIsEditing(true);
    }
  };

  // Function to handle category name change
  const handleCategoryChange = (categoryId, newName) => {
    setEditedCategories({
      ...editedCategories,
      [categoryId]: newName
    });
  };

  // Function to save all edited categories
  const handleSaveChanges = async () => {
    setError('');
    setSuccessMessage('');
    
    try {
      const promises = Object.entries(editedCategories).map(async ([categoryId, name]) => {
        // Skip categories that haven't changed
        const category = categories.find(c => c.id === parseInt(categoryId));
        if (category && category.name === name) return;
        
        // Update categories that have changed
        return await updateCategoryAPI(categoryId, { name });
      });
      
      await Promise.all(promises.filter(p => p !== undefined));
      
      setSuccessMessage('Cập nhật danh mục thành công');
      fetchCategories(); // Refresh the list
      setIsEditing(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật danh mục:', err);
      setError('Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại.');
    }
  };

  // Function to handle category deletion click
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setConfirmDelete(true);
  };

  // Function to confirm deletion
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategoryAPI(categoryToDelete.id);
      setSuccessMessage(`Đã xóa danh mục ${categoryToDelete.name} thành công`);
      setCategoryToDelete(null);
      setConfirmDelete(false);
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error('Lỗi khi xóa danh mục:', err);
      setError('Không thể xóa danh mục. Danh mục này có thể đang được sử dụng bởi một số món ăn.');
    }
  };

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setCategoryToDelete(null);
    setConfirmDelete(false);
  };

  // Show loading state
  if (loading && categories.length === 0) {
    return (
      <div className="category-container">
        <h2>Quản lý danh mục món ăn</h2>
        <div className="category-loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="category-container">
      <h2>Quản lý danh mục món ăn</h2>
      
      {/* Success message */}
      {successMessage && (
        <div className="category-success-message">
          {successMessage}
          <button 
            className="category-close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="category-error-message">
          {error}
          <button 
            className="category-close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Edit mode toggle and save buttons */}
      <div className="category-actions">
        {isEditing ? (
          <div className="category-edit-actions">
            <button 
              className="category-save-button"
              onClick={handleSaveChanges}
            >
              Lưu thay đổi
            </button>
            <button 
              className="category-cancel-button"
              onClick={handleEditToggle}
            >
              Hủy
            </button>
          </div>
        ) : (
          <button 
            className="category-edit-button"
            onClick={handleEditToggle}
          >
            Chỉnh sửa thông tin
          </button>
        )}
      </div>

      {/* Categories table */}
      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>Tên mục</th>
              <th>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  {isEditing ? (
                    <div className="category-edit-field">
                      <img src={categoryItemIcon} alt="Danh mục" className="category-icon" />
                      <input
                        type="text"
                        value={editedCategories[category.id] || ''}
                        onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                        className="category-edit-input"
                      />
                    </div>
                  ) : (
                    <div className="category-name-field">
                      <img src={categoryItemIcon} alt="Danh mục" className="category-icon" />
                      <span>{category.name}</span>
                    </div>
                  )}
                </td>
                <td className="category-action-cell">
                  <button 
                    className="category-icon-button category-delete-button"
                    onClick={() => handleDeleteClick(category)}
                    title="Xóa danh mục"
                    disabled={isEditing}
                  >
                    <img src={deleteIcon} alt="Xóa" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation dialog for deletion */}
      {confirmDelete && categoryToDelete && (
        <div className="category-confirm-delete-overlay">
          <div className="category-confirm-delete">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete.name}"?</p>
            <p className="category-confirm-delete-warning">
              Lưu ý: Nếu có món ăn đang sử dụng danh mục này, bạn sẽ không thể xóa được.
            </p>
            <div className="category-confirm-delete-actions">
              <button 
                className="category-confirm-delete-button"
                onClick={handleConfirmDelete}
              >
                Xóa
              </button>
              <button 
                className="category-cancel-delete-button"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category; 