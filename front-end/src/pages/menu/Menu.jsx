import React, { useState, useEffect } from 'react';
import { MenuSideBar, MenuItem, PaginationBar } from '../../components';
import './Menu.css';

const Menu = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [filters, setFilters] = useState({
    area: 'Tất cả',
    branch: 'Tất cả',
    category: 'Tất cả',
    dish: 'Tất cả'
  });

  // Dummy data - sau này sẽ được thay thế bằng dữ liệu từ API
  const menuItems = [
    {
      id: 1,
      name: 'Gỏi Cuốn Tôm Thịt',
      description: 'Gỏi cuốn tươi với tôm, thịt heo, bún và rau thơm',
      price: 65000,
      category: 'appetizer',
      image: '',
      status: 'hot'
    },
    {
      id: 2,
      name: 'Chả Giò Hải Sản',
      description: 'Chả giò giòn rụm với nhân hải sản thơm ngon',
      price: 75000,
      category: 'appetizer',
      image: '',
      status: ''
    },
    {
      id: 3,
      name: 'Bò Lúc Lắc',
      description: 'Thịt bò xào với ớt chuông và các loại gia vị đặc biệt',
      price: 150000,
      category: 'main',
      image: '',
      status: 'new'
    },
    {
      id: 4,
      name: 'Cá Hồi Nướng Miso',
      description: 'Cá hồi tươi nướng với sốt miso truyền thống',
      price: 180000,
      category: 'main',
      image: '',
      status: ''
    },
    {
      id: 5,
      name: 'Bánh Flan Caramel',
      description: 'Bánh flan mềm mịn với lớp caramel ngọt ngào',
      price: 45000,
      category: 'dessert',
      image: '',
      status: ''
    },
    {
      id: 6,
      name: 'Chè Hạt Sen',
      description: 'Chè hạt sen thơm ngon với nước cốt dừa',
      price: 40000,
      category: 'dessert',
      image: '',
      status: 'promotion'
    },
    {
      id: 7,
      name: 'Sinh Tố Xoài',
      description: 'Sinh tố xoài tươi ngon với đá xay mịn',
      price: 55000,
      category: 'drink',
      image: '',
      status: ''
    },
    {
      id: 8,
      name: 'Trà Sen Vàng',
      description: 'Trà thơm với hương sen tinh tế',
      price: 45000,
      category: 'drink',
      image: '',
      status: ''
    },
    {
      id: 9,
      name: 'Phở Bò Tái Nạm',
      description: 'Phở bò với nước dùng ngọt thanh và thịt bò mềm',
      price: 85000,
      category: 'main',
      image: '',
      status: 'hot'
    },
    {
      id: 10,
      name: 'Bún Chả Hà Nội',
      description: 'Bún chả với thịt nướng thơm lừng và nước mắm ngọt thanh',
      price: 75000,
      category: 'main',
      image: '',
      status: ''
    },
    {
      id: 11,
      name: 'Bánh Mì Thịt Nướng',
      description: 'Bánh mì giòn với thịt nướng, rau sống và sốt đặc biệt',
      price: 35000,
      category: 'appetizer',
      image: '',
      status: ''
    },
    {
      id: 12,
      name: 'Cơm Cháy Sườn Sốt',
      description: 'Cơm cháy giòn với sườn xào chua ngọt',
      price: 95000,
      category: 'main',
      image: '',
      status: 'new'
    }
  ];

  // Lọc món ăn theo danh mục từ bộ lọc
  const filteredItems = filters.category === 'Tất cả' 
    ? menuItems 
    : menuItems.filter(item => {
      // Chuyển đổi tên danh mục tiếng Việt sang loại danh mục tiếng Anh trong dữ liệu
      const categoryMap = {
        'Khai Vị': 'appetizer',
        'Món Chính': 'main',
        'Tráng Miệng': 'dessert',
        'Đồ Uống': 'drink'
      };
      
      const categoryToFilter = categoryMap[filters.category] || filters.category;
      return item.category === categoryToFilter;
    });

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  
  // Tính tổng số trang
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Xử lý khi chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
  };

  // Reset lại trang đầu tiên khi số lượng món ăn thay đổi
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
    </div>
  );
};

export default Menu; 