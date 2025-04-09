import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDishAPI } from '../../../api';
import { listDishAPI } from '../../../api';
import { defaultAvatar } from '../../../assets';
import './NewDish.css';

const NewDish = () => {
  const navigate = useNavigate();
  
  // dish data state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null
  });
  
  // image preview
  const [imagePreview, setImagePreview] = useState('');
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  // error state
  const [errors, setErrors] = useState([]);
  // success state
  const [success, setSuccess] = useState('');
  // categories list
  const [categories, setCategories] = useState([]);

  // fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dishesData = await listDishAPI();
        
        // Extract unique categories
        const uniqueCategories = [];
        const categoryIds = new Set();
        
        dishesData.forEach(dish => {
          if (dish.category && !categoryIds.has(dish.category)) {
            categoryIds.add(dish.category);
            uniqueCategories.push({
              id: dish.category,
              name: dish.category_name
            });
          }
        });
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách danh mục:', err);
        setErrors(['Không thể lấy danh sách danh mục. Vui lòng thử lại sau.']);
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    if (name === 'price') {
      // Ensure price is a positive number
      const price = Math.max(0, parseInt(value) || 0);
      setFormData({
        ...formData,
        price
      });
    } else {
      setFormData({
        ...formData,
        [name]: newValue
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = [];
    
    // validate required fields
    if (!formData.name) {
      newErrors.push('Tên món ăn là bắt buộc');
    }
    
    if (!formData.price) {
      newErrors.push('Giá món ăn là bắt buộc');
    } else if (formData.price <= 0) {
      newErrors.push('Giá món ăn phải lớn hơn 0');
    }
    
    if (!formData.category) {
      newErrors.push('Danh mục món ăn là bắt buộc');
    }
    
    if (!formData.image) {
      newErrors.push('Hình ảnh món ăn là bắt buộc');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors([]);
    setSuccess('');
    
    try {
      // Prepare data for API
      const formDataToSend = new FormData();
      
      // Add dish data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('category', formData.category);
      
      // Add image if provided
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Send request to API
      await createDishAPI(formDataToSend);
      
      // Handle successful response
      setSuccess('Thêm món ăn mới thành công!');
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        image: null
      });
      setImagePreview('');
      
      // Redirect to dishes page after a short delay
      setTimeout(() => {
        navigate('/dashboard/admin');
      }, 1500);
      
    } catch (err) {
      console.error('Lỗi khi thêm món ăn mới:', err);
      
      if (err.response && err.response.data) {
        // Handle validation errors from the backend
        const errorData = err.response.data;
        let errorMessages = [];
        
        if (typeof errorData === 'object') {
          // Process error object to create a readable message array
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              errorMessages.push(`${key}: ${errorData[key].join(', ')}`);
            } else if (typeof errorData[key] === 'object') {
              Object.keys(errorData[key]).forEach(subKey => {
                errorMessages.push(`${subKey}: ${errorData[key][subKey].join(', ')}`);
              });
            } else {
              errorMessages.push(`${key}: ${errorData[key]}`);
            }
          });
        } else {
          errorMessages.push('Đã xảy ra lỗi khi thêm món ăn mới');
        }
        
        setErrors(errorMessages);
      } else {
        setErrors(['Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại sau.']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dish-add-container">
      <h2>Thêm món ăn mới</h2>
      
      {/* Error messages */}
      {errors.length > 0 && (
        <div className="dish-error-message">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="dish-success-message">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Form header with image preview */}
        <div className="dish-form-header">
          <div className="dish-image-section">
            <div className="dish-image-container">
              <img 
                src={imagePreview || defaultAvatar} 
                alt="Hình ảnh món ăn" 
                className="dish-image-preview"
              />
              <label htmlFor="dish-image-upload" className="dish-image-upload-label">
                Chọn ảnh
                <input
                  id="dish-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="dish-image-input"
                />
              </label>
            </div>
          </div>
        </div>
        
        {/* Form content */}
        <div className="dish-form-content">
          {/* Dish name */}
          <div className="dish-input-group">
            <div className="dish-input-wrapper">
              <label htmlFor="name">Tên món ăn:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên món ăn"
                required
              />
            </div>
          </div>
          
          {/* Dish price */}
          <div className="dish-input-group">
            <div className="dish-input-wrapper">
              <label htmlFor="price">Giá (VNĐ):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Nhập giá món ăn"
                min="0"
                required
              />
            </div>
          </div>
          
          {/* Dish category */}
          <div className="dish-input-group">
            <div className="dish-input-wrapper">
              <label htmlFor="category">Danh mục:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Dish description */}
          <div className="dish-input-group full-width">
            <div className="dish-input-wrapper">
              <label htmlFor="description">Mô tả:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả món ăn"
                rows="4"
              />
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="dish-form-actions">
          <button 
            type="submit" 
            className="dish-save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Thêm món ăn'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDish; 