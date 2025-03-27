import React, { useState, useEffect } from 'react';
import { ListManagerInfoAPI, fireManagerAPI } from '../../../api/accounts/ManagerAPI';
import { updateIcon, deleteIcon, defaultAvatar } from '../../../assets';
import { ManagerPopupWindow } from '../../../components';
import './ManagerManagement.css';

const ManagerManagement = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showManagerPopup, setShowManagerPopup] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState(null);

  // Fetch managers when component mounts
  useEffect(() => {
    fetchManagers();
  }, []);

  // Function to format avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return defaultAvatar;
    
    // If avatar already has http/https, return as is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    // If avatar is a relative path, construct full URL
    const baseUrl = import.meta.env.VITE_BACKEND_API.split('/api')[0];
    return `${baseUrl}${avatarPath}`;
  };

  // Function to fetch managers from API
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const data = await ListManagerInfoAPI();
      setManagers(data);
      setError('');
    } catch (err) {
      console.error('Lỗi khi lấy danh sách quản lý:', err);
      setError('Không thể lấy danh sách quản lý. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle manager update click
  const handleUpdateClick = (managerId) => {
    setSelectedManagerId(managerId);
    setShowManagerPopup(true);
  };

  // Function to handle manager deletion click
  const handleDeleteClick = (managerId, fullName) => {
    setManagerToDelete({ id: managerId, name: fullName });
    setConfirmDelete(true);
  };

  // Function to confirm deletion
  const handleConfirmDelete = async () => {
    if (!managerToDelete) return;
    
    try {
      setLoading(true);
      await fireManagerAPI(managerToDelete.id);
      setSuccessMessage(`Đã sa thải quản lý ${managerToDelete.name} thành công`);
      
      // Update the managers list to reflect the change
      setManagers(prevManagers => 
        prevManagers.map(manager => 
          manager.user.id === managerToDelete.id 
            ? { ...manager, resignation_date: new Date().toISOString().split('T')[0] } 
            : manager
        )
      );
      
      // Close confirmation dialog
      setConfirmDelete(false);
      setManagerToDelete(null);
    } catch (err) {
      console.error('Lỗi khi sa thải quản lý:', err);
      setError('Không thể sa thải quản lý. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setManagerToDelete(null);
  };

  // Function to close manager popup
  const handleCloseManagerPopup = () => {
    setShowManagerPopup(false);
    setSelectedManagerId(null);
    // Refresh manager data
    fetchManagers();
  };

  // Function to render manager status
  const renderStatus = (resignationDate) => {
    return resignationDate === null ? (
      <span className="status-active">Đang làm việc</span>
    ) : (
      <span className="status-inactive">Đã nghỉ việc</span>
    );
  };

  // Show loading state
  if (loading && managers.length === 0) {
    return (
      <div className="manager-management-container">
        <h2>Quản lý chi nhánh</h2>
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="manager-management-container">
      <h2>Quản lý chi nhánh</h2>
      
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

      {/* Managers table */}
      <div className="managers-table-container">
        <table className="managers-table">
          <thead>
            <tr>
              <th className="avatar-header">Ảnh đại diện</th>
              <th>Họ tên</th>
              <th>Trạng thái</th>
              <th>Chi nhánh</th>
              <th>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.user.id} className={manager.resignation_date ? 'inactive' : ''}>
                <td className="avatar-cell">
                  <img 
                    src={getAvatarUrl(manager.user.avatar)} 
                    alt={manager.user.full_name || 'Quản lý'} 
                    className="manager-avatar"
                  />
                </td>
                <td>{manager.user.full_name || 'Chưa cập nhật'}</td>
                <td>{renderStatus(manager.resignation_date)}</td>
                <td>{manager.branch_name || 'Chưa phân công'}</td>
                <td className="action-cell">
                  <button 
                    className="icon-button update-button"
                    onClick={() => handleUpdateClick(manager.user.id)}
                    title="Cập nhật thông tin"
                  >
                    <img src={updateIcon} alt="Cập nhật" />
                  </button>
                  
                  {manager.resignation_date === null && (
                    <button 
                      className="icon-button delete-button"
                      onClick={() => handleDeleteClick(manager.user.id, manager.user.full_name)}
                      title="Sa thải quản lý"
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
      {confirmDelete && managerToDelete && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3>Xác nhận sa thải</h3>
            <p>Bạn chắc chắn muốn đuổi việc quản lý này chứ?</p>
            <div className="button-container">
              <button className="confirm-button" onClick={handleConfirmDelete}>Có, tôi chắc chắn</button>
              <button className="cancel-button" onClick={handleCancelDelete}>Không, hủy bỏ</button>
            </div>
          </div>
        </div>
      )}

      {/* Manager Popup Window for updating manager */}
      {showManagerPopup && selectedManagerId && (
        <div className="manager-popup-container">
          <ManagerPopupWindow 
            managerInfo={managers.find(manager => manager.user.id === selectedManagerId)} 
            onClose={handleCloseManagerPopup} 
          />
        </div>
      )}
    </div>
  );
};

export default ManagerManagement; 