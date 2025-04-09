import React, { useState } from 'react';
import { createCategoryAPI } from '../../../api/menu/CategoryAPI';
import { categoryIcon } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import './NewCategory.css';

const NewCategory = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }
    
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await createCategoryAPI({ name: categoryName });
      setSuccessMessage('Tạo danh mục mới thành công!');
      setCategoryName('');
      
      // Tự động chuyển về trang quản lý danh mục sau khi tạo thành công
      setTimeout(() => {
        navigate('/dashboard/admin');
      }, 1500);
    } catch (err) {
      console.error('Lỗi khi tạo danh mục:', err);
      if (err.response?.data?.name) {
        setError(err.response.data.name[0]);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Có lỗi xảy ra khi tạo danh mục');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-category-container">
      <h2>Tạo danh mục mới</h2>

      {error && (
        <div className="new-category-error-message">
          {error}
          <button 
            className="new-category-close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {successMessage && (
        <div className="new-category-success-message">
          {successMessage}
          <button 
            className="new-category-close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      <form className="new-category-form" onSubmit={handleSubmit}>
        <div className="new-category-form-group">
          <label htmlFor="name">
            <img src={categoryIcon} alt="Danh mục" />
            Tên danh mục
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={categoryName}
            onChange={handleChange}
            required
            placeholder="Nhập tên danh mục"
            disabled={isSubmitting}
          />
        </div>

        <div className="new-category-form-actions">
          <button 
            type="submit" 
            className="new-category-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Thêm danh mục'}
          </button>
          <button 
            type="button" 
            className="new-category-cancel-button"
            onClick={() => navigate('/dashboard/admin/categories')}
            disabled={isSubmitting}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCategory; 