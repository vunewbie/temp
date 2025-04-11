import React, { useState, useEffect } from 'react';
import { MenuSideBar, MenuItem, PaginationBar } from '../../components';
import './Menu.css';
import { IoRestaurantOutline } from 'react-icons/io5';

// Import API functions
import { listMenuItemsAPI } from '../../api/menu/MenuAPI';
import { listAreaInfoAPI } from '../../api/establishments/AreaAPI';
import { listBranchInfoAPI } from '../../api/establishments/BranchAPI';

// Base URL cho media files từ biến môi trường
const MEDIA_URL = import.meta.env.VITE_MEDIA_URL;

const Menu = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    area: '',
    branch: '',
    category: 'Tất cả',
    dish: 'Tất cả'
  });
  
  // State store branch name and area
  const [currentBranchName, setCurrentBranchName] = useState('');

  // Fetch initial data - get first area and branch to display
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Get area list
        const areaData = await listAreaInfoAPI();
        if (areaData.length > 0) {
          const firstArea = areaData[0];
          
          // Get branch list in first area
          const branchData = await listBranchInfoAPI({ area: firstArea.id });
          if (branchData.length > 0) {
            const firstBranch = branchData[0];
            
            // Update filters with first area and branch
            setFilters(prev => ({
              ...prev,
              area: firstArea.id,
              branch: firstBranch.id
            }));
            
            // Store branch name
            setCurrentBranchName(firstBranch.name);
            
            // Get menu of first branch
            await fetchMenuItems(firstBranch.id);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi khởi tạo dữ liệu:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);
  
  // Function to get menu data based on filters
  const fetchMenuItems = async (branchId, categoryId = null, dishId = null) => {
    try {
      setLoading(true);
      
      // Prepare filter parameters for API
      const apiFilters = { branch: branchId };
      
      if (categoryId && categoryId !== 'Tất cả') {
        apiFilters.category = categoryId;
      }
      
      // Get menu data from API
      const data = await listMenuItemsAPI(apiFilters);
      
      // Filter out only items with is_available=true
      const availableMenuItems = data.filter(menu => menu.is_available === true);
      
      // If there is a filter for specific dish
      if (dishId && dishId !== 'Tất cả') {
        const filteredData = availableMenuItems.filter(item => item.dish === dishId);
        
        // Convert data to format suitable for MenuItem
        const formattedItems = filteredData.map(menu => ({
          id: menu.id,
          name: menu.dish_name,
          price: menu.dish_price,
          image: menu.dish_image ? `${MEDIA_URL}${menu.dish_image}` : '',
          status: menu.status || ''
        }));
        
        setMenuItems(formattedItems);
      } else {
        // No filter for specific dish
        // Convert data to format suitable for MenuItem
        const formattedItems = availableMenuItems.map(menu => ({
          id: menu.id,
          name: menu.dish_name,
          price: menu.dish_price,
          image: menu.dish_image ? `${MEDIA_URL}${menu.dish_image}` : '',
          status: menu.status || ''
        }));
        
        setMenuItems(formattedItems);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu menu:', err);
      setError('Không thể tải dữ liệu menu. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Find current branch name if branch changes
    if (newFilters.branch !== filters.branch) {
      listBranchInfoAPI({ area: newFilters.area }).then(branches => {
        const selectedBranch = branches.find(branch => branch.id === newFilters.branch);
        if (selectedBranch) {
          setCurrentBranchName(selectedBranch.name);
        }
      }).catch(error => {
        console.error('Lỗi khi lấy thông tin chi nhánh:', error);
      });
    }
    
    // Get new data based on filters
    fetchMenuItems(newFilters.branch, newFilters.category, newFilters.dish);
  };

  // Reset to first page when menu items change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="menu-page-container">
      <div className="menu-page-sidebar">
        <MenuSideBar onFilterChange={handleFilterChange} />
      </div>
      
      <div className="menu-page-content">
        {loading ? (
          <div className="menu-loading">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="menu-error">{error}</div>
        ) : menuItems.length === 0 ? (
          <div className="menu-empty">Không có món ăn nào phù hợp với bộ lọc.</div>
        ) : (
          <div className="menu-items-container">
            <h2 className="menu-items-title">
              <IoRestaurantOutline size={24} className="icon" />
              Thực Đơn {currentBranchName && `- ${currentBranchName}`}
              <span className="menu-items-count">({menuItems.length} món)</span>
            </h2>
            
            <div className="menu-items-grid">
              {currentItems.map(item => (
                <MenuItem key={item.id} dish={item} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <PaginationBar 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu; 