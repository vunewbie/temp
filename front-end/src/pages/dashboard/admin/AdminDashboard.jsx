import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { SideBar, UserInfo, ChangePassword, Area, NewArea, Branch, NewBranch,
         Dish, NewDish, Category, NewCategory, Department, NewDepartment, ManagerManagement,
         NewManager, Promotion, NewPromotion, Statistics } from '../../../components';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('user-info');
  const [isScrolling, setIsScrolling] = useState(false);
  const contentRef = useRef(null);

  // track scroll state
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop } = contentRef.current;
        setIsScrolling(scrollTop > 10);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Render content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'user-info':
        return <UserInfo />;
      case 'change-password':
        return <ChangePassword />;
      case 'area':
        return <Area />;
      case 'new-area':
        return <NewArea />;
      case 'branch':
        return <Branch />;
      case 'new-branch':
        return <NewBranch />;
      case 'dish':
        return <Dish />;
      case 'new-dish':
        return <NewDish />;
      case 'category':
        return <Category />;
      case 'new-category':
        return <NewCategory />;
      case 'department':
        return <Department />;
      case 'new-department':
        return <NewDepartment />;
      case 'manager-management':
        return <ManagerManagement />;
      case 'new-manager':
        return <NewManager />;
      case 'promotion':
        return <Promotion />;
      case 'new-promotion':
        return <NewPromotion />;
      case 'statistics':
        return <Statistics />;
      default:
        return <UserInfo />;
    }
  };

  // If user is not admin, redirect or show error
  if (!user || user.type !== 'A') {
    return (
      <div className="not-authorized">
        <h2>Không có quyền truy cập</h2>
        <p>Bạn không có quyền truy cập trang này</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <SideBar 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
        />
        
        <div 
          ref={contentRef} 
          className={`dashboard-content ${isScrolling ? 'is-scrolling' : ''}`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;