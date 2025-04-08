import React, { useState, useEffect } from 'react';
import { listAreaInfoAPI } from '../../../api/establishments/AreaAPI';
import { updateIcon } from '../../../assets';
import { AreaPopupWindow } from '../../../components';
import './Area.css';

const Area = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAreaPopup, setShowAreaPopup] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);

  // Fetch areas when component mounts
  useEffect(() => {
    fetchAreas();
  }, []);

  // Function to fetch areas from API
  const fetchAreas = async () => {
    try {
      setLoading(true);
      const data = await listAreaInfoAPI();
      setAreas(data);
      setError('');
    } catch (err) {
      console.error('Lỗi khi lấy danh sách khu vực:', err);
      setError('Không thể lấy danh sách khu vực. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle area update click
  const handleUpdateClick = (areaId) => {
    setSelectedAreaId(areaId);
    setShowAreaPopup(true);
  };

  // Function to close area popup
  const handleCloseAreaPopup = () => {
    setShowAreaPopup(false);
    setSelectedAreaId(null);
    // Refresh area data
    fetchAreas();
  };

  // Show loading state
  if (loading && areas.length === 0) {
    return (
      <div className="area-container">
        <h2>Quản lý khu vực</h2>
        <div className="area-loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="area-container">
      <h2>Quản lý khu vực</h2>
      
      {/* Success message */}
      {successMessage && (
        <div className="area-success-message">
          {successMessage}
          <button 
            className="area-close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="area-error-message">
          {error}
          <button 
            className="area-close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Areas table */}
      <div className="area-table-container">
        <table className="area-table">
          <thead>
            <tr>
              <th>Quận</th>
              <th>Thành phố</th>
              <th>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                <td>{area.district || 'Chưa cập nhật'}</td>
                <td>{area.city || 'Chưa cập nhật'}</td>
                <td className="area-action-cell">
                  <button 
                    className="area-icon-button area-update-button"
                    onClick={() => handleUpdateClick(area.id)}
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

      {/* Area Popup Window for updating area */}
      {showAreaPopup && selectedAreaId && (
        <div className="area-popup-container">
          <AreaPopupWindow 
            areaInfo={areas.find(area => area.id === selectedAreaId)} 
            onClose={handleCloseAreaPopup} 
          />
        </div>
      )}
    </div>
  );
};

export default Area; 