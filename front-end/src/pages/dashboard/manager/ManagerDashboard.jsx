import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { SideBar, UserInfo, ChangePassword, EmployeeManagement, Recruitment,
         MenuManagement, TableManagement, NewTable, ManagerNewDish as NewDish
} from '../../../components';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
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
      case 'employee-management':
        return <EmployeeManagement />;
      case 'recruitment':
        return <Recruitment />;
      case 'menu-management':
        return <MenuManagement />;
      case 'new-dish':
        return <NewDish />;
      case 'table-management':
        return <TableManagement />;
      case 'new-table':
        return <NewTable />;
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

export default ManagerDashboard; 