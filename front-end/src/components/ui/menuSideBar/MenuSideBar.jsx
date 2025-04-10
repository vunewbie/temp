import React, { useState } from 'react';
import './MenuSideBar.css';
import { TbFilter, TbFilterOff } from 'react-icons/tb';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { BsCheckCircleFill } from 'react-icons/bs';
import { areaIcon, branchIcon, categoryIcon, dishIcon } from '../../../assets';

const MenuSideBar = ({ onFilterChange }) => {
  const [selectedArea, setSelectedArea] = useState('Tất cả');
  const [selectedBranch, setSelectedBranch] = useState('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedDish, setSelectedDish] = useState('Tất cả');
  
  // Các giá trị tạm thời để lưu trữ trước khi áp dụng
  const [tempSelectedArea, setTempSelectedArea] = useState('Tất cả');
  const [tempSelectedBranch, setTempSelectedBranch] = useState('Tất cả');
  const [tempSelectedCategory, setTempSelectedCategory] = useState('Tất cả');
  const [tempSelectedDish, setTempSelectedDish] = useState('Tất cả');
  
  // Biến kiểm tra xem có cần áp dụng bộ lọc không
  const [filterChanged, setFilterChanged] = useState(false);
  
  const [openSections, setOpenSections] = useState({
    area: false,
    branch: false,
    category: false,
    dish: false
  });

  const toggleSection = (section) => {
    const newOpenSections = { ...openSections };
    // Đóng tất cả section khác
    Object.keys(newOpenSections).forEach(key => {
      newOpenSections[key] = key === section ? !newOpenSections[key] : false;
    });
    setOpenSections(newOpenSections);
  };

  const resetFilters = () => {
    setSelectedArea('Tất cả');
    setSelectedBranch('Tất cả');
    setSelectedCategory('Tất cả');
    setSelectedDish('Tất cả');
    
    setTempSelectedArea('Tất cả');
    setTempSelectedBranch('Tất cả');
    setTempSelectedCategory('Tất cả');
    setTempSelectedDish('Tất cả');
    
    setFilterChanged(false);
    
    // Notify parent component about filter change
    if (onFilterChange) {
      onFilterChange({
        area: 'Tất cả',
        branch: 'Tất cả',
        category: 'Tất cả',
        dish: 'Tất cả'
      });
    }
  };

  const handleTempChange = (type, value) => {
    if (type === 'area') {
      setTempSelectedArea(value);
    } else if (type === 'branch') {
      setTempSelectedBranch(value);
    } else if (type === 'category') {
      setTempSelectedCategory(value);
    } else if (type === 'dish') {
      setTempSelectedDish(value);
    }

    // Đóng dropdown sau khi chọn
    setOpenSections({
      ...openSections,
      [type]: false
    });
    
    // Kiểm tra xem có thay đổi nào so với bộ lọc hiện tại không
    const hasChanges = 
      value !== (type === 'area' ? selectedArea : 
      type === 'branch' ? selectedBranch : 
      type === 'category' ? selectedCategory : 
      selectedDish);
      
    if (hasChanges) {
      setFilterChanged(true);
    }
  };
  
  // Áp dụng các bộ lọc tạm thời
  const applyFilters = () => {
    setSelectedArea(tempSelectedArea);
    setSelectedBranch(tempSelectedBranch);
    setSelectedCategory(tempSelectedCategory);
    setSelectedDish(tempSelectedDish);
    
    setFilterChanged(false);
    
    // Notify parent component about filter change
    if (onFilterChange) {
      onFilterChange({
        area: tempSelectedArea,
        branch: tempSelectedBranch,
        category: tempSelectedCategory,
        dish: tempSelectedDish
      });
    }
  };

  // Danh sách các tùy chọn lọc
  const areaOptions = ['Tất cả', 'Hà Nội', 'Đà Nẵng', 'Hồ Chí Minh'];
  const branchOptions = ['Tất cả', 'Chi nhánh 1', 'Chi nhánh 2', 'Chi nhánh 3'];
  const categoryOptions = ['Tất cả', 'Khai Vị', 'Món Chính', 'Tráng Miệng', 'Đồ Uống'];
  const dishOptions = ['Tất cả', 'Món Nhật', 'Món Hàn', 'Món Việt', 'Món Âu'];

  return (
    <div className="msb-container">
      <div className="msb-header">
        <TbFilter className="msb-filter-icon" />
        <h3>Bộ Lọc Thực Đơn</h3>
      </div>
      
      <div className="msb-content">
        {/* Area Section */}
        <div className="msb-section">
          <div 
            className={`msb-select-header ${openSections.area ? 'active' : ''}`} 
            onClick={() => toggleSection('area')}
          >
            <img src={areaIcon} alt="Khu vực" className="msb-section-icon" />
            <div className="msb-select-info">
              <span className="msb-select-label">Khu Vực</span>
              <span className="msb-selected-value">{tempSelectedArea}</span>
            </div>
            {openSections.area ? (
              <IoIosArrowUp className="msb-arrow-icon" />
            ) : (
              <IoIosArrowDown className="msb-arrow-icon" />
            )}
          </div>
          
          {openSections.area && (
            <div className="msb-dropdown-content">
              {areaOptions.map((option) => (
                <div 
                  key={option} 
                  className={`msb-dropdown-item ${tempSelectedArea === option ? 'selected' : ''}`}
                  onClick={() => handleTempChange('area', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Branch Section */}
        <div className="msb-section">
          <div 
            className={`msb-select-header ${openSections.branch ? 'active' : ''}`} 
            onClick={() => toggleSection('branch')}
          >
            <img src={branchIcon} alt="Chi nhánh" className="msb-section-icon" />
            <div className="msb-select-info">
              <span className="msb-select-label">Chi Nhánh</span>
              <span className="msb-selected-value">{tempSelectedBranch}</span>
            </div>
            {openSections.branch ? (
              <IoIosArrowUp className="msb-arrow-icon" />
            ) : (
              <IoIosArrowDown className="msb-arrow-icon" />
            )}
          </div>
          
          {openSections.branch && (
            <div className="msb-dropdown-content">
              {branchOptions.map((option) => (
                <div 
                  key={option} 
                  className={`msb-dropdown-item ${tempSelectedBranch === option ? 'selected' : ''}`}
                  onClick={() => handleTempChange('branch', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Category Section */}
        <div className="msb-section">
          <div 
            className={`msb-select-header ${openSections.category ? 'active' : ''}`} 
            onClick={() => toggleSection('category')}
          >
            <img src={categoryIcon} alt="Mục" className="msb-section-icon" />
            <div className="msb-select-info">
              <span className="msb-select-label">Mục</span>
              <span className="msb-selected-value">{tempSelectedCategory}</span>
            </div>
            {openSections.category ? (
              <IoIosArrowUp className="msb-arrow-icon" />
            ) : (
              <IoIosArrowDown className="msb-arrow-icon" />
            )}
          </div>
          
          {openSections.category && (
            <div className="msb-dropdown-content">
              {categoryOptions.map((option) => (
                <div 
                  key={option} 
                  className={`msb-dropdown-item ${tempSelectedCategory === option ? 'selected' : ''}`}
                  onClick={() => handleTempChange('category', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Dish Section */}
        <div className="msb-section">
          <div 
            className={`msb-select-header ${openSections.dish ? 'active' : ''}`} 
            onClick={() => toggleSection('dish')}
          >
            <img src={dishIcon} alt="Món ăn" className="msb-section-icon" />
            <div className="msb-select-info">
              <span className="msb-select-label">Món Ăn</span>
              <span className="msb-selected-value">{tempSelectedDish}</span>
            </div>
            {openSections.dish ? (
              <IoIosArrowUp className="msb-arrow-icon" />
            ) : (
              <IoIosArrowDown className="msb-arrow-icon" />
            )}
          </div>
          
          {openSections.dish && (
            <div className="msb-dropdown-content">
              {dishOptions.map((option) => (
                <div 
                  key={option} 
                  className={`msb-dropdown-item ${tempSelectedDish === option ? 'selected' : ''}`}
                  onClick={() => handleTempChange('dish', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="msb-footer">
        <div className="msb-buttons">
          <button 
            className="msb-reset-button" 
            onClick={resetFilters}
          >
            <TbFilterOff className="msb-reset-icon" />
            Xóa Bộ Lọc
          </button>
          
          <button 
            className={`msb-apply-button ${filterChanged ? 'active' : ''}`} 
            onClick={applyFilters}
            disabled={!filterChanged}
          >
            <BsCheckCircleFill className="msb-apply-icon" />
            Áp Dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuSideBar;
