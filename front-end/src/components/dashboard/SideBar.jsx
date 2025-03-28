// libraries
import React, { useState } from 'react';
import { FaTimes, FaBars } from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
// context
import { useAuth } from '../../context/AuthContext';
// styles
import './SideBar.css';
// common icons
import { accountIcon, passwordIcon } from '../../assets/index';
// customer icons
import { purchaseIcon, pointIcon } from '../../assets/index';
// manager icons
import { employeeManagementIcon, newEmployeeIcon, menuManagementIcon, newDishIcon, tableManagementIcon, newTableIcon } from '../../assets/index';
// employee icons
import { serveIcon, reservationIcon, deliveryIcon } from '../../assets/index';
// admin icons
import { areaIcon, newAreaIcon, branchIcon, newBranchIcon, dishIcon, newDishAdminIcon, 
  categoryIcon, newCategoryIcon, departmentIcon, newDepartmentIcon, managerManagementIcon, 
  newManagerIcon, promotionIcon, newPromotionIcon, statisticsIcon } from '../../assets/index';

const SideBar = ({ activeMenu, setActiveMenu }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // common menu items for all user types
  const commonMenuItems = [
    { id: 'user-info', label: 'Thông tin tài khoản', icon: accountIcon },
    { id: 'change-password', label: 'Đổi mật khẩu', icon: passwordIcon }
  ];

  // menu items for each user type
  const customerMenuItems = [
    { id: 'purchase-history', label: 'Lịch sử mua hàng', icon: purchaseIcon },
    { id: 'points-history', label: 'Lịch sử điểm thưởng', icon: pointIcon }
  ];

  const managerMenuItems = [
    { id: 'employee-management', label: 'Nhân sự', icon: employeeManagementIcon },
    { id: 'recruitment', label: 'Tuyển dụng', icon: newEmployeeIcon },
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
    { id: 'manager-management', label: 'Quản lý chi nhánh', icon: managerManagementIcon },
    { id: 'new-manager', label: 'Quản lý chi nhánh mới', icon: newManagerIcon },
    { id: 'promotion', label: 'Ưu đãi', icon: promotionIcon },
    { id: 'new-promotion', label: 'Ưu đãi mới', icon: newPromotionIcon },
    { id: 'statistics', label: 'Thống kê', icon: statisticsIcon }
  ];

  // select menu items based on user type
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

  // combine common and specific menu items
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