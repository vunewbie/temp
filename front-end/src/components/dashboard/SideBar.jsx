import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes, FaBars } from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import './SideBar.css';

import accountIcon from '../../assets/dashboard/account-icon.svg';
import passwordIcon from '../../assets/dashboard/password-icon.svg';
import purchaseIcon from '../../assets/dashboard/customer/purchase-icon.svg';
import pointIcon from '../../assets/dashboard/customer/point-icon.svg';

// Import manager icons
import employeeManagementIcon from '../../assets/dashboard/manager/employee-management-icon.svg';
import recruitmentIcon from '../../assets/dashboard/manager/recruitment-icon.svg';
import menuManagementIcon from '../../assets/dashboard/manager/menu-management-icon.svg';
import newDishIcon from '../../assets/dashboard/manager/new-dish-icon.svg';
import tableManagementIcon from '../../assets/dashboard/manager/table-management-icon.svg';
import newTableIcon from '../../assets/dashboard/manager/new-table-icon.svg';

// Import employee icons
import serveIcon from '../../assets/dashboard/employee/serve-icon.svg';
import reservationIcon from '../../assets/dashboard/employee/reservation-icon.svg';
import deliveryIcon from '../../assets/dashboard/employee/delivery-icon.svg';

// Import admin icons
import areaIcon from '../../assets/dashboard/admin/area-icon.svg';
import newAreaIcon from '../../assets/dashboard/admin/new-area-icon.svg';
import branchIcon from '../../assets/dashboard/admin/branch-icon.svg';
import newBranchIcon from '../../assets/dashboard/admin/new-branch-icon.svg';
import dishIcon from '../../assets/dashboard/admin/dish-icon.svg';
import newDishAdminIcon from '../../assets/dashboard/admin/new-dish-icon.svg';
import categoryIcon from '../../assets/dashboard/admin/category-icon.svg';
import newCategoryIcon from '../../assets/dashboard/admin/new-category-icon.svg';
import departmentIcon from '../../assets/dashboard/admin/department-icon.svg';
import newDepartmentIcon from '../../assets/dashboard/admin/new-department-icon.svg';
import branchManagerIcon from '../../assets/dashboard/admin/branch-manager-icon.svg';
import newBranchManagerIcon from '../../assets/dashboard/admin/new-branch-manager-icon.svg';
import promotionIcon from '../../assets/dashboard/admin/promotion-icon.svg';
import newPromotionIcon from '../../assets/dashboard/admin/new-promotion-icon.svg';
import statisticsIcon from '../../assets/dashboard/admin/statistics-icon.svg';

const SideBar = ({ activeMenu, setActiveMenu }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Common menu items for all user types
  const commonMenuItems = [
    { id: 'user-info', label: 'Thông tin tài khoản', icon: accountIcon },
    { id: 'change-password', label: 'Đổi mật khẩu', icon: passwordIcon }
  ];

  // Menu items for each user type
  const customerMenuItems = [
    { id: 'purchase-history', label: 'Lịch sử mua hàng', icon: purchaseIcon },
    { id: 'points-history', label: 'Lịch sử điểm thưởng', icon: pointIcon }
  ];

  const managerMenuItems = [
    { id: 'employee-management', label: 'Nhân sự', icon: employeeManagementIcon },
    { id: 'recruitment', label: 'Tuyển dụng', icon: recruitmentIcon },
    { id: 'menu-management', label: 'Thực đơn', icon: menuManagementIcon },
    { id: 'new-dish', label: 'Món mới', icon: newDishIcon },
    { id: 'table-management', label: 'Bàn', icon: tableManagementIcon },
    { id: 'new-table', label: 'Bàn mới', icon: newTableIcon }
  ];

  const employeeMenuItems = [
    { id: 'serve', label: 'Phục vụ', icon: serveIcon },
    { id: 'reservation', label: 'Phiếu đặt bàn', icon: reservationIcon },
    { id: 'delivery', label: 'Phiếu giao hàng', icon: deliveryIcon }
  ];

  const adminMenuItems = [
    { id: 'area', label: 'Khu vực', icon: areaIcon },
    { id: 'new-area', label: 'Khu vực mới', icon: newAreaIcon },
    { id: 'branch', label: 'Chi nhánh', icon: branchIcon },
    { id: 'new-branch', label: 'Chi nhánh mới', icon: newBranchIcon },
    { id: 'dish', label: 'Món ăn', icon: dishIcon },
    { id: 'new-dish', label: 'Món mới', icon: newDishAdminIcon },
    { id: 'category', label: 'Mục', icon: categoryIcon },
    { id: 'new-category', label: 'Mục mới', icon: newCategoryIcon },
    { id: 'department', label: 'Bộ phận', icon: departmentIcon },
    { id: 'new-department', label: 'Bộ phận mới', icon: newDepartmentIcon },
    { id: 'branch-manager', label: 'Quản lý chi nhánh', icon: branchManagerIcon },
    { id: 'new-branch-manager', label: 'Quản lý chi nhánh mới', icon: newBranchManagerIcon },
    { id: 'promotion', label: 'Ưu đãi', icon: promotionIcon },
    { id: 'new-promotion', label: 'Ưu đãi mới', icon: newPromotionIcon },
    { id: 'statistics', label: 'Thống kê', icon: statisticsIcon }
  ];

  // Select menu items based on user type
  let specificMenuItems = [];
  switch (user?.type) {
    case 'C':
      specificMenuItems = customerMenuItems;
      break;
    case 'M':
      specificMenuItems = managerMenuItems;
      break;
    case 'E':
      specificMenuItems = employeeMenuItems;
      break;
    case 'A':
      specificMenuItems = adminMenuItems;
      break;
    default:
      specificMenuItems = [];
  }

  // Combine common and specific menu items
  const menuItems = [...commonMenuItems, ...specificMenuItems];

  return (
    <div className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <MdOutlineKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />}
      </div>
      
      <div className="sidebar-header">
        <h3>Dashboard</h3>
        <div className="mobile-toggle">
          {isSidebarOpen ? <FaTimes onClick={toggleSidebar} /> : <FaBars onClick={toggleSidebar} />}
        </div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => setActiveMenu(item.id)}
          >
            <img src={item.icon} alt={item.label} className="menu-icon" />
            {isSidebarOpen && <span className="menu-label">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar; 