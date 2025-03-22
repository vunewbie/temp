import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import SideBar from '../../../components/dashboard/SideBar';
import UserInfo from '../../../components/dashboard/UserInfo';
import ChangePassword from '../../../components/dashboard/ChangePassword';

// Import admin-specific components
import Area from '../../../components/dashboard/admin/Area';
import NewArea from '../../../components/dashboard/admin/NewArea';
import Branch from '../../../components/dashboard/admin/Branch';
import NewBranch from '../../../components/dashboard/admin/NewBranch';
import Dish from '../../../components/dashboard/admin/Dish';
import NewDish from '../../../components/dashboard/admin/NewDish';
import Category from '../../../components/dashboard/admin/Category';
import NewCategory from '../../../components/dashboard/admin/NewCategory';
import Department from '../../../components/dashboard/admin/Department';
import NewDepartment from '../../../components/dashboard/admin/NewDepartment';
import BranchManager from '../../../components/dashboard/admin/BranchManager';
import NewBranchManager from '../../../components/dashboard/admin/NewBranchManager';
import Promotion from '../../../components/dashboard/admin/Promotion';
import NewPromotion from '../../../components/dashboard/admin/NewPromotion';
import Statistics from '../../../components/dashboard/admin/Statistics';

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
      case 'branch-manager':
        return <BranchManager />;
      case 'new-branch-manager':
        return <NewBranchManager />;
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