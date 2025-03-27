import React, { useState, useEffect } from 'react';
import { listEmployeeInfoAPI, fireEmployeeAPI } from '../../../api';
import { updateIcon, deleteIcon } from '../../../assets';
import { defaultAvatar } from '../../../assets';
import { StaffPopupWindow } from '../../../components';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showStaffPopup, setShowStaffPopup] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Fetch employees when component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Function to format avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return defaultAvatar;
    
    // If avatar already has http/https, return as is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    // If avatar is a relative path, construct full URL
    // For example, if avatar is /media/avatars/image.jpg
    // We need to prepend the API base URL
    const baseUrl = import.meta.env.VITE_BACKEND_API.split('/api')[0];
    return `${baseUrl}${avatarPath}`;
  };

  // Function to fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await listEmployeeInfoAPI();
      setEmployees(data);
      setError('');
    } catch (err) {
      console.error('Lỗi khi lấy danh sách nhân viên:', err);
      setError('Không thể lấy danh sách nhân viên. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle employee update click
  const handleUpdateClick = (employeeId) => {
    const selectedEmployee = employees.find(employee => employee.user.id === employeeId);
    setSelectedEmployeeId(employeeId);
    setShowStaffPopup(true);
  };

  // Function to handle employee deletion click
  const handleDeleteClick = (employeeId, fullName) => {
    setEmployeeToDelete({ id: employeeId, name: fullName });
    setConfirmDelete(true);
  };

  // Function to confirm deletion
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      setLoading(true);
      await fireEmployeeAPI(employeeToDelete.id);
      setSuccessMessage(`Đã sa thải nhân viên ${employeeToDelete.name} thành công`);
      
      // Update the employees list to reflect the change
      setEmployees(prevEmployees => 
        prevEmployees.map(employee => 
          employee.user.id === employeeToDelete.id 
            ? { ...employee, resignation_date: new Date().toISOString().split('T')[0] } 
            : employee
        )
      );
      
      // Close confirmation dialog
      setConfirmDelete(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error('Lỗi khi sa thải nhân viên:', err);
      setError('Không thể sa thải nhân viên. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setEmployeeToDelete(null);
  };

  // Function to close staff popup
  const handleCloseStaffPopup = () => {
    setShowStaffPopup(false);
    setSelectedEmployeeId(null);
    // Refresh employee data
    fetchEmployees();
  };

  // Function to render employee status
  const renderStatus = (resignationDate) => {
    return resignationDate === null ? (
      <span className="status-active">Đang làm việc</span>
    ) : (
      <span className="status-inactive">Đã nghỉ việc</span>
    );
  };

  // Show loading state
  if (loading && employees.length === 0) {
    return (
      <div className="employee-management-container">
        <h2>Quản lý nhân sự</h2>
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="employee-management-container">
      <h2>Quản lý nhân sự</h2>
      
      {/* Success message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button 
            className="close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
          <button 
            className="close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Employees table */}
      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th className="avatar-header">Ảnh đại diện</th>
              <th>Họ tên</th>
              <th>Trạng thái</th>
              <th>Bộ phận</th>
              <th>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.user.id} className={employee.resignation_date ? 'inactive' : ''}>
                <td className="avatar-cell">
                  <img 
                    src={getAvatarUrl(employee.user.avatar)} 
                    alt={employee.user.full_name || 'Nhân viên'} 
                    className="employee-avatar"
                  />
                </td>
                <td>{employee.user.full_name || 'Chưa cập nhật'}</td>
                <td>{renderStatus(employee.resignation_date)}</td>
                <td>{employee.department_name || 'Chưa phân công'}</td>
                <td className="action-cell">
                  <button 
                    className="icon-button update-button"
                    onClick={() => handleUpdateClick(employee.user.id)}
                    title="Cập nhật thông tin"
                  >
                    <img src={updateIcon} alt="Cập nhật" />
                  </button>
                  
                  {employee.resignation_date === null && (
                    <button 
                      className="icon-button delete-button"
                      onClick={() => handleDeleteClick(employee.user.id, employee.user.full_name)}
                      title="Sa thải nhân viên"
                    >
                      <img src={deleteIcon} alt="Sa thải" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation dialog for deletion */}
      {confirmDelete && employeeToDelete && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3>Xác nhận sa thải</h3>
            <p>Bạn chắc chắn muốn đuổi việc nhân viên {employeeToDelete.name} chứ?</p>
            <div className="button-container">
              <button className="confirm-button" onClick={handleConfirmDelete}>Có, tôi chắc chắn</button>
              <button className="cancel-button" onClick={handleCancelDelete}>Không, hủy bỏ</button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Popup Window for updating employee */}
      {showStaffPopup && selectedEmployeeId && (
        <div className="staff-popup-container">
          <StaffPopupWindow 
            employeeInfo={employees.find(employee => employee.user.id === selectedEmployeeId)} 
            onClose={handleCloseStaffPopup} 
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement; 