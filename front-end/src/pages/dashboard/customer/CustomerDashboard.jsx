import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import SideBar from '../../../components/dashboard/SideBar';
import UserInfo from '../../../components/dashboard/UserInfo';
import ChangePassword from '../../../components/dashboard/ChangePassword';
import PurchaseHistory from '../../../components/dashboard/customer/PurchaseHistory';
import CumulativePointsHistory from '../../../components/dashboard/customer/CumulativePointsHistory';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
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

  // render content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'user-info':
        return <UserInfo />;
      case 'change-password':
        return <ChangePassword />;
      case 'purchase-history':
        return <PurchaseHistory />;
      case 'points-history':
        return <CumulativePointsHistory />;
      default:
        return <UserInfo />;
    }
  };

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

export default CustomerDashboard; 