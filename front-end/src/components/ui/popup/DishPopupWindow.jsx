import React, { useState, useEffect } from 'react';
import { listDishAPI, updateDishAPI, createDishAPI } from '../../../api';
import { listCategoryAPI } from '../../../api/menu/CategoryAPI';
import { defaultAvatar } from '../../../assets';
import './DishPopupWindow.css';

const DishPopupWindow = ({ dishId, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [categories, setCategories] = useState([]);
    const [isCreating, setIsCreating] = useState(!dishId); // If no dishId is provided, we're creating a new dish
    
    // dish data
    const [dishData, setDishData] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        image: null,
        category: '',
        categoryName: '',
        status: true // Giá trị mặc định khi tạo mới là Đang bán
    });
    
    // image preview
    const [imagePreview, setImagePreview] = useState('');
    
    // initialize data from props when component is loaded
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch categories and dish details concurrently
                const [categoriesData, dishesData] = await Promise.all([
                    listCategoryAPI(),
                    listDishAPI()
                ]);
                
                // Format categories data
                const formattedCategories = categoriesData.map(category => ({
                    id: category.id,
                    name: category.name
                }));
                
                setCategories(formattedCategories);
                
                // If editing an existing dish, find it in the data
                if (dishId) {
                    const dish = dishesData.find(d => d.id === dishId);
                    
                    if (dish) {
                        setDishData({
                            id: dish.id || '',
                            name: dish.name || '',
                            price: dish.price || '',
                            description: dish.description || '',
                            image: dish.image || null,
                            category: dish.category || '',
                            categoryName: dish.category_name || '',
                            status: dish.status !== undefined ? dish.status : true
                        });
                        
                        // update image preview
                        if (dish.image) {
                            setImagePreview(dish.image);
                        }
                    } else {
                        setError('Không tìm thấy thông tin món ăn.');
                    }
                } else {
                    // Nếu đang tạo mới món ăn và có danh mục, thiết lập giá trị mặc định là danh mục đầu tiên
                    if (formattedCategories.length > 0) {
                        const defaultCategory = formattedCategories[0];
                        setDishData(prevData => ({
                            ...prevData,
                            category: defaultCategory.id,
                            categoryName: defaultCategory.name
                        }));
                    }
                }
                
            } catch (err) {
                console.error('Lỗi khi khởi tạo thông tin món ăn:', err);
                setError('Không thể khởi tạo thông tin món ăn. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [dishId]);
    
    // handle fields change
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'category') {
            // Find the selected category to get its name
            const category = categories.find(c => c.id === parseInt(value));
            setDishData({
                ...dishData,
                category: parseInt(value),
                categoryName: category ? category.name : ''
            });
        } else if (name === 'price') {
            // Ensure price is a positive number
            const price = Math.max(0, parseInt(value) || 0);
            setDishData({
                ...dishData,
                price
            });
        } else if (name === 'status') {
            // Convert string 'true'/'false' to boolean
            const statusValue = value === 'true';
            setDishData({
                ...dishData,
                status: statusValue
            });
        } else {
            setDishData({
                ...dishData,
                [name]: value
            });
        }
    };
    
    // handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDishData({
                ...dishData,
                image: file
            });
            
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const formData = new FormData();
            
            // Add all fields to form data
            formData.append('name', dishData.name);
            formData.append('price', dishData.price);
            formData.append('description', dishData.description || '');
            formData.append('category', dishData.category);
            formData.append('status', dishData.status.toString());
            
            // Only append image if it's a File object (new upload)
            if (dishData.image instanceof File) {
                formData.append('image', dishData.image);
            }
            
            let response;
            
            if (isCreating) {
                // Create new dish
                response = await createDishAPI(formData);
                setSuccess('Món ăn mới đã được tạo thành công.');
            } else {
                // Update existing dish
                response = await updateDishAPI(dishData.id, formData);
                setSuccess('Thông tin món ăn đã được cập nhật thành công.');
            }
            
            // Reset editing state
            setIsEditing(false);
            
            // Close popup after 1 second
            setTimeout(() => {
                onClose();
            }, 1000);
            
        } catch (err) {
            console.error('Lỗi khi lưu thông tin món ăn:', err);
            
            if (err.response && err.response.data) {
                // get first error field from response data
                const firstErrorField = Object.keys(err.response.data)[0];
                const firstError = err.response.data[firstErrorField][0];
                setError(firstError);
            } else {
                // general error
                setError('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // function to get image url
    const getImageUrl = (imagePath) => {
        if (!imagePath) return defaultAvatar;
        
        // if image is a preview (base64)
        if (typeof imagePath === 'string' && imagePath.startsWith('data:')) {
            return imagePath;
        }
        
        // if image has http/https, keep it
        if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
            return imagePath;
        }
        
        // if image is relative path, create full url
        const baseUrl = import.meta.env.VITE_BACKEND_API.split('/api')[0];
        return `${baseUrl}${imagePath}`;
    };
    
    // show loading state
    if (isLoading && !dishData.name && !isCreating) {
        return (
            <div className="dish-popup-window">
                <h2>{isCreating ? 'Thêm món ăn mới' : 'Thông tin món ăn'}</h2>
                <div className="loading">Đang tải dữ liệu...</div>
            </div>
        );
    }
    
    return (
        <div className="dish-popup-window">
            <h2>{isCreating ? 'Thêm món ăn mới' : 'Thông tin món ăn'}</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-header">
                    <div className="image-section">
                        <div className="image-container">
                            <img 
                                src={getImageUrl(imagePreview || dishData.image)} 
                                alt="Hình ảnh món ăn" 
                                className="dish-image-preview"
                            />
                            {(isEditing || isCreating) && (
                                <div className="image-upload-overlay">
                                    <label htmlFor="image-upload" className="upload-button">
                                        Chọn ảnh
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="dish-actions">
                        {!isEditing && !isCreating ? (
                            <button 
                                type="button" 
                                className="edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa thông tin
                            </button>
                        ) : (
                            <div className="edit-actions">
                                {!isCreating && (
                                    <button 
                                        type="button" 
                                        className="cancel-button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset form data to last saved state
                                            const category = categories.find(c => c.id === parseInt(dishData.category));
                                            setDishData({
                                                ...dishData,
                                                categoryName: category ? category.name : ''
                                            });
                                        }}
                                    >
                                        Hủy
                                    </button>
                                )}
                                <button 
                                    type="submit" 
                                    className="save-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Form fields */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Tên món:</label>
                        <input
                            type="text"
                            name="name"
                            value={dishData.name}
                            onChange={handleChange}
                            disabled={!isEditing && !isCreating}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Giá (VNĐ):</label>
                        <input
                            type="number"
                            name="price"
                            value={dishData.price}
                            onChange={handleChange}
                            disabled={!isEditing && !isCreating}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Danh mục:</label>
                        <select
                            name="category"
                            value={dishData.category || ''}
                            onChange={handleChange}
                            disabled={!isEditing && !isCreating}
                            required
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {!dishData.category && isCreating && (
                            <div className="field-error">Vui lòng chọn danh mục</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Trạng thái:</label>
                        <select
                            name="status"
                            value={dishData.status.toString()}
                            onChange={handleChange}
                            disabled={!isEditing && !isCreating}
                        >
                            <option value="true">Đang bán</option>
                            <option value="false">Ngừng bán</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group full-width">
                        <label>Mô tả:</label>
                        <textarea
                            name="description"
                            value={dishData.description}
                            onChange={handleChange}
                            disabled={!isEditing && !isCreating}
                            rows="4"
                        />
                    </div>
                </div>
                
                {!isEditing && !isCreating && (
                    <div className="popup-actions">
                        <button 
                            type="button" 
                            className="close-popup-button"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default DishPopupWindow; 