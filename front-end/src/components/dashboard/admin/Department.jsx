import React, { useState, useEffect } from 'react';
import { listDepartmentInfoAPI } from '../../../api/establishments/DepartmentAPI';
import { updateIcon } from '../../../assets';
import { DepartmentPopupWindow } from '../../../components';
import './Department.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDepartmentPopup, setShowDepartmentPopup] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  // Fetch departments when component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Function to fetch departments from API
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await listDepartmentInfoAPI();
      setDepartments(data);
      setError('');
    } catch (err) {
      console.error('Lỗi khi lấy danh sách bộ phận:', err);
      setError('Không thể lấy danh sách bộ phận. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle department update click
  const handleUpdateClick = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setShowDepartmentPopup(true);
  };

  // Function to close department popup
  const handleCloseDepartmentPopup = () => {
    setShowDepartmentPopup(false);
    setSelectedDepartmentId(null);
    // Refresh department data
    fetchDepartments();
  };

  // Format salary value with comma separators
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(salary);
  };

  // Show loading state
  if (loading && departments.length === 0) {
    return (
      <div className="department-container">
        <h2>Quản lý bộ phận</h2>
        <div className="department-loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="department-container">
      <h2>Quản lý bộ phận</h2>
      
      {/* Success message */}
      {successMessage && (
        <div className="department-success-message">
          {successMessage}
          <button 
            className="department-close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="department-error-message">
          {error}
          <button 
            className="department-close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Departments table */}
      <div className="department-table-container">
        <table className="department-table">
          <thead>
            <tr>
              <th>Tên bộ phận</th>
              <th>Lương</th>
              <th>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td>{department.name || 'Chưa cập nhật'}</td>
                <td>{department.salary ? formatSalary(department.salary) + ' đ' : 'Chưa cập nhật'}</td>
                <td className="department-action-cell">
                  <button 
                    className="department-icon-button department-update-button"
                    onClick={() => handleUpdateClick(department.id)}
                    title="Cập nhật thông tin"
                  >
                    <img src={updateIcon} alt="Cập nhật" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Department Popup Window for updating department */}
      {showDepartmentPopup && selectedDepartmentId && (
        <div className="department-popup-container">
          <DepartmentPopupWindow 
            departmentInfo={departments.find(department => department.id === selectedDepartmentId)} 
            onClose={handleCloseDepartmentPopup} 
          />
        </div>
      )}
    </div>
  );
};

export default Department; 