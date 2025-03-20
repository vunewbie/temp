import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes, FaBars } from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import './SideBar.css';

import accountIcon from '../../assets/dashboard/customer/account-icon.svg';
import passwordIcon from '../../assets/dashboard/customer/password-icon.svg';
import purchaseIcon from '../../assets/dashboard/customer/purchase-icon.svg';
import pointIcon from '../../assets/dashboard/customer/point-icon.svg';

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
    // Add manager-specific menu items after
  ];

  const employeeMenuItems = [
    // Add employee-specific menu items after
  ];

  const adminMenuItems = [
    // Add admin-specific menu items after
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