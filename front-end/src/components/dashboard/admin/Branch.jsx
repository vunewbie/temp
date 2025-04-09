import React, { useState, useEffect } from 'react';
import { listBranchInfoAPI } from '../../../api/establishments/BranchAPI';
import { listAreaInfoAPI } from '../../../api/establishments/AreaAPI';
import { updateIcon } from '../../../assets';
import { BranchPopupWindow } from '../../../components';
import './Branch.css';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showBranchPopup, setShowBranchPopup] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');

  // Fetch branches and areas when component mounts
  useEffect(() => {
    fetchAreas();
    fetchBranches();
  }, []);

  // Fetch branches when selected area changes
  useEffect(() => {
    fetchBranches();
  }, [selectedArea]);

  // Function to fetch areas from API
  const fetchAreas = async () => {
    try {
      const data = await listAreaInfoAPI();
      setAreas(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách khu vực:', err);
      setError('Không thể lấy danh sách khu vực. Vui lòng thử lại sau.');
    }
  };

  // Function to fetch branches from API
  const fetchBranches = async () => {
    try {
      setLoading(true);
      
      // If an area is selected, filter by area
      if (selectedArea) {
        const data = await listBranchInfoAPI({ area: selectedArea });
        setBranches(data);
      } else {
        const data = await listBranchInfoAPI();
        setBranches(data);
      }
      
      setError('');
    } catch (err) {
      console.error('Lỗi khi lấy danh sách chi nhánh:', err);
      setError('Không thể lấy danh sách chi nhánh. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle area selection change
  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  // Function to handle branch update click
  const handleUpdateClick = (branchId) => {
    setSelectedBranchId(branchId);
    setShowBranchPopup(true);
  };

  // Function to close branch popup
  const handleCloseBranchPopup = () => {
    setShowBranchPopup(false);
    setSelectedBranchId(null);
    // Refresh branch data
    fetchBranches();
  };

  // Show loading state
  if (loading && branches.length === 0) {
    return (
      <div className="branch-container">
        <h2>Quản lý chi nhánh</h2>
        <div className="branch-loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="branch-container">
      <h2>Quản lý chi nhánh</h2>
      
      {/* Success message */}
      {successMessage && (
        <div className="branch-success-message">
          {successMessage}
          <button 
            className="branch-close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="branch-error-message">
          {error}
          <button 
            className="branch-close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Area filter */}
      <div className="branch-filter-container">
        <div className="branch-filter-content">
          <div className="branch-filter-item">
            <label htmlFor="area-filter">Lọc theo khu vực:</label>
            <select 
              id="area-filter" 
              value={selectedArea} 
              onChange={handleAreaChange}
              className="area-select"
            >
              <option value="">Tất cả khu vực</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.district}, {area.city}
                </option>
              ))}
            </select>
          </div>
          {selectedArea && (
            <button 
              className="branch-clear-filter-button"
              onClick={() => setSelectedArea('')}
              title="Xóa bộ lọc"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Branches table */}
      <div className="branch-table-container">
        <table className="branch-table">
          <thead>
            <tr>
              <th>Tên chi nhánh</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Khu vực</th>
              <th>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td>{branch.name || 'Chưa cập nhật'}</td>
                <td>{branch.address || 'Chưa cập nhật'}</td>
                <td>{branch.phone_number || 'Chưa cập nhật'}</td>
                <td>{branch.area_name || 'Không xác định'}</td>
                <td className="branch-action-cell">
                  <button 
                    className="branch-icon-button branch-update-button"
                    onClick={() => handleUpdateClick(branch.id)}
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

      {/* Branch Popup Window for updating branch */}
      {showBranchPopup && selectedBranchId && (
        <div className="branch-popup-container">
          <BranchPopupWindow 
            branchInfo={branches.find(branch => branch.id === selectedBranchId)} 
            onClose={handleCloseBranchPopup} 
          />
        </div>
      )}
    </div>
  );
};

export default Branch; 