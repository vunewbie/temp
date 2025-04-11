import React, { useState, useEffect } from 'react';
import './MenuSideBar.css';
import { TbFilter, TbFilterOff } from 'react-icons/tb';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { BsCheckCircleFill } from 'react-icons/bs';
import { areaIcon, branchIcon, categoryIcon, dishIcon } from '../../../assets';

// Import các API functions
import { listAreaInfoAPI } from '../../../api/establishments/AreaAPI';
import { listBranchInfoAPI } from '../../../api/establishments/BranchAPI';
import { listCategoryAPI } from '../../../api/menu/CategoryAPI';
import { listMenuItemsAPI } from '../../../api/menu/MenuAPI';

const MenuSideBar = ({ onFilterChange }) => {
  // States for final selected value (after applying)
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedDish, setSelectedDish] = useState('Tất cả');
  
  // States for temporary value (before applying)
  const [tempSelectedArea, setTempSelectedArea] = useState('');
  const [tempSelectedBranch, setTempSelectedBranch] = useState('');
  const [tempSelectedCategory, setTempSelectedCategory] = useState('Tất cả');
  const [tempSelectedDish, setTempSelectedDish] = useState('Tất cả');
  
  // States for list data from API
  const [areas, setAreas] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([{ id: 0, name: 'Tất cả' }]);
  const [dishes, setDishes] = useState([{ id: 0, name: 'Tất cả' }]);
  
  // Variable to check if there is any change to apply
  const [filterChanged, setFilterChanged] = useState(false);
  
  // State to manage open/closed sections
  const [openSections, setOpenSections] = useState({
    area: false,
    branch: false,
    category: false,
    dish: false
  });

  // Fetch area list when component is mounted
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areaData = await listAreaInfoAPI();
        setAreas(areaData);
        
        // If there is area data, select the first area as default
        if (areaData.length > 0) {
          const firstArea = areaData[0];
          setSelectedArea(firstArea.id);
          setTempSelectedArea(firstArea.id);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khu vực:', error);
      }
    };
    
    fetchAreas();
  }, []);
  
  // Fetch branch list when area changes
  useEffect(() => {
    const fetchBranches = async () => {
      if (tempSelectedArea) {
        try {
          const branchData = await listBranchInfoAPI({ area: tempSelectedArea });
          setBranches(branchData);
          
          // If there is branch data, select the first branch as default
          if (branchData.length > 0) {
            const firstBranch = branchData[0];
            setTempSelectedBranch(firstBranch.id);
          } else {
            setTempSelectedBranch('');
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách chi nhánh:', error);
        }
      }
    };
    
    fetchBranches();
  }, [tempSelectedArea]);
  
  // Fetch category list when component is mounted
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await listCategoryAPI();
        // Add "All" option to the beginning of the list
        setCategories([{ id: 0, name: 'Tất cả' }, ...categoryData]);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch dish list when branch or category changes
  useEffect(() => {
    const fetchDishes = async () => {
      if (tempSelectedBranch) {
        try {
          const filters = {
            branch: tempSelectedBranch
          };
          
          if (tempSelectedCategory !== 'Tất cả') {
            filters.category = tempSelectedCategory;
          }
          
          const menuData = await listMenuItemsAPI(filters);
          
          // Filter out items with is_available = true
          const availableMenuItems = menuData.filter(menu => menu.is_available === true);
          
          // Create dish list from filtered menu data
          const dishOptions = availableMenuItems.map(menu => ({
            id: menu.dish,
            name: menu.dish_name
          }));
          
          // Remove duplicate dishes
          const uniqueDishes = Array.from(new Map(dishOptions.map(dish => 
            [dish.id, dish])).values());
          
          // Add "All" option to the beginning of the list
          setDishes([{ id: 0, name: 'Tất cả' }, ...uniqueDishes]);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách món ăn:', error);
        }
      }
    };
    
    fetchDishes();
  }, [tempSelectedBranch, tempSelectedCategory]);
  
  const toggleSection = (section) => {
    const newOpenSections = { ...openSections };
    // Close all other sections
    Object.keys(newOpenSections).forEach(key => {
      newOpenSections[key] = key === section ? !newOpenSections[key] : false;
    });
    setOpenSections(newOpenSections);
  };

  const resetFilters = () => {
    // If there is area data, select the first area as default
    if (areas.length > 0) {
      const firstArea = areas[0];
      setSelectedArea(firstArea.id);
      setTempSelectedArea(firstArea.id);
      
      // Get branch list of the first area
      const firstAreaBranches = branches.filter(branch => branch.area === firstArea.id);
      if (firstAreaBranches.length > 0) {
        setSelectedBranch(firstAreaBranches[0].id);
        setTempSelectedBranch(firstAreaBranches[0].id);
      }
    }
    
    setSelectedCategory('Tất cả');
    setTempSelectedCategory('Tất cả');
    setSelectedDish('Tất cả');
    setTempSelectedDish('Tất cả');
    
    setFilterChanged(false);
    
    // Notify the parent component about the filter change
    if (onFilterChange) {
      onFilterChange({
        area: areas.length > 0 ? areas[0].id : '',
        branch: branches.length > 0 ? branches.filter(branch => branch.area === (areas.length > 0 ? areas[0].id : ''))[0]?.id : '',
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

    // Close dropdown after selecting
    setOpenSections({
      ...openSections,
      [type]: false
    });
    
    // Check if there is any change compared to the current filter
    const hasChanges = 
      value !== (type === 'area' ? selectedArea : 
      type === 'branch' ? selectedBranch : 
      type === 'category' ? selectedCategory : 
      selectedDish);
      
    if (hasChanges) {
      setFilterChanged(true);
    }
  };
  
  // Apply temporary filters
  const applyFilters = () => {
    setSelectedArea(tempSelectedArea);
    setSelectedBranch(tempSelectedBranch);
    setSelectedCategory(tempSelectedCategory);
    setSelectedDish(tempSelectedDish);
    
    setFilterChanged(false);
    
    // Notify the parent component about the filter change
    if (onFilterChange) {
      onFilterChange({
        area: tempSelectedArea,
        branch: tempSelectedBranch,
        category: tempSelectedCategory,
        dish: tempSelectedDish
      });
    }
  };

  // Get display name for selected area
  const getAreaDisplayName = (areaId) => {
    if (areaId === '') return '';
    const area = areas.find(a => a.id === areaId);
    return area ? `${area.district}, ${area.city}` : '';
  };
  
  // Get display name for selected branch
  const getBranchDisplayName = (branchId) => {
    if (branchId === '') return '';
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : '';
  };
  
  // Get display name for selected category
  const getCategoryDisplayName = (categoryId) => {
    if (categoryId === 'Tất cả') return 'Tất cả';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };

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
              <span className="msb-selected-value">{getAreaDisplayName(tempSelectedArea)}</span>
            </div>
            {openSections.area ? (
              <IoIosArrowUp className="msb-arrow-icon" />
            ) : (
              <IoIosArrowDown className="msb-arrow-icon" />
            )}
          </div>
          
          {openSections.area && (
            <div className="msb-dropdown-content">
              {areas.map((area) => (
                <div 
                  key={area.id} 
                  className={`msb-dropdown-item ${tempSelectedArea === area.id ? 'selected' : ''}`}
                  onClick={() => handleTempChange('area', area.id)}
                >
                  {`${area.district}, ${area.city}`}
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
              <span className="msb-selected-value">{getBranchDisplayName(tempSelectedBranch)}</span>
            </div>
            {openSections.branch ? (
              <IoIosArrowUp className="msb-arrow-icon" />
            ) : (
              <IoIosArrowDown className="msb-arrow-icon" />
            )}
          </div>
          
          {openSections.branch && (
            <div className="msb-dropdown-content">
              {branches.map((branch) => (
                <div 
                  key={branch.id} 
                  className={`msb-dropdown-item ${tempSelectedBranch === branch.id ? 'selected' : ''}`}
                  onClick={() => handleTempChange('branch', branch.id)}
                >
                  {branch.name}
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
              <span className="msb-selected-value">{getCategoryDisplayName(tempSelectedCategory)}</span>
            </div>
            {openSections.category ? (
              <IoIosArrowUp className="msb-arrow-icon" />
            ) : (
              <IoIosArrowDown className="msb-arrow-icon" />
            )}
          </div>
          
          {openSections.category && (
            <div className="msb-dropdown-content">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={`msb-dropdown-item ${tempSelectedCategory === (category.id === 0 ? 'Tất cả' : category.id) ? 'selected' : ''}`}
                  onClick={() => handleTempChange('category', category.id === 0 ? 'Tất cả' : category.id)}
                >
                  {category.name}
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
              <span className="msb-selected-value">{tempSelectedDish === 'Tất cả' ? 'Tất cả' : dishes.find(d => d.id === tempSelectedDish)?.name || ''}</span>
            </div>
            {openSections.dish ? (
              <IoIosArrowUp className="msb-arrow-icon" />
            ) : (
              <IoIosArrowDown className="msb-arrow-icon" />
            )}
          </div>
          
          {openSections.dish && (
            <div className="msb-dropdown-content">
              {dishes.map((dish) => (
                <div 
                  key={dish.id} 
                  className={`msb-dropdown-item ${tempSelectedDish === (dish.id === 0 ? 'Tất cả' : dish.id) ? 'selected' : ''}`}
                  onClick={() => handleTempChange('dish', dish.id === 0 ? 'Tất cả' : dish.id)}
                >
                  {dish.name}
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
