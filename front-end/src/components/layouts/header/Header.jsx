// Libraries
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Auth Context
import { useAuth } from '../../../context/AuthContext';
// Icons
import { FaSignOutAlt, FaTachometerAlt, FaUser, FaCaretDown } from 'react-icons/fa';
// Assets 
import logo from '../../../assets/logo.jpg';
// Styles
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  // handle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // handle get dashboard link
  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch(user.type) {
      case 'A':
        return '/dashboard/admin';
      case 'M':
        return '/dashboard/manager';
      case 'E':
        return '/dashboard/employee';
      case 'C':
        return '/dashboard/customer';
      default:
        return '/';
    }
  };

  // handle toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // handle close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <img src={logo} alt="Vunewbie Restaurant" />
          </Link>
        </div>

        <div className="nav-container">
          <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={location.pathname === '/about' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link 
                  to="/menu" 
                  className={location.pathname === '/menu' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Thực Đơn
                </Link>
              </li>
              <li>
                <Link 
                  to="/reservation" 
                  className={location.pathname === '/reservation' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Đặt Bàn
                </Link>
              </li>
              <li>
                <Link 
                  to="/delivery" 
                  className={location.pathname === '/delivery' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Giao Hàng
                </Link>
              </li>
              <li>
                <Link 
                  to="/promotions" 
                  className={location.pathname === '/promotions' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Ưu Đãi
                </Link>
              </li>
              <li>
                <Link 
                  to="/reviews" 
                  className={location.pathname === '/reviews' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Đánh Giá
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="auth-container">
          {isAuthenticated && user ? (
            <div className="user-dropdown">
              <div 
                className="user-info"
                onClick={toggleDropdown}
              >
                <div className="user-avatar">
                  <FaUser />
                </div>
                {user.username && user.username.length > 10 ? (
                  <span className="username">Chào {user.username.slice(0, 10)}...</span>
                ) : (
                  <span className="username">Chào {user.username}</span>
                )}
                <FaCaretDown className="dropdown-icon" />
              </div>
              
              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <FaUser />
                    </div>
                    <div className="dropdown-user-info">
                      {user.username && user.username.length > 10 ? (
                        <span className="dropdown-username">{user.username.slice(0, 10)}...</span>
                      ) : (
                        <span className="dropdown-username">{user.username}</span>
                      )}
                      <span className="dropdown-usertype">
                        {user.type === 'A' && 'Chủ sở hữu'}
                        {user.type === 'M' && 'Quản lý'}
                        {user.type === 'E' && 'Nhân viên'}
                        {user.type === 'C' && 'Khách hàng'}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={getDashboardLink()}
                    className="dropdown-item"
                  >
                    <div className="dropdown-item-content">
                      <FaTachometerAlt className="dropdown-item-icon" />
                      <span>
                        {user.type === 'A' && 'Quản Trị Công Ty'}
                        {user.type === 'M' && 'Quản Lý Nhà Hàng'}
                        {user.type === 'E' && 'Trang Nhân Viên'}
                        {user.type === 'C' && 'Tài Khoản'}
                      </span>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item"
                  >
                    <div className="dropdown-item-content">
                      <FaSignOutAlt className="dropdown-item-icon" />
                      <span>Đăng Xuất</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
            <Link to="/login" className="login-button">Đăng Nhập</Link>
            <Link to="/register" className="register-button">Đăng Ký</Link>
            </>
          )}
        </div>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </header>
  );
};

export default Header; 