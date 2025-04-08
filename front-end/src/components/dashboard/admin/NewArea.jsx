import React, { useState } from 'react';
import { createAreaAPI } from '../../../api/establishments/AreaAPI';
import { cityIcon, districtIcon } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import './NewArea.css';

const NewArea = () => {
  const navigate = useNavigate();
  const [areaData, setAreaData] = useState({
    district: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAreaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await createAreaAPI(areaData);
      setSuccessMessage('Tạo khu vực mới thành công!');
      setTimeout(() => {
        // refresh page
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Lỗi khi tạo khu vực:', err);
      setError(err.response?.data?.detail || 'Có lỗi xảy ra khi tạo khu vực');
    }
  };

  return (
    <div className="new-area-container">
      <h2>Tạo khu vực mới</h2>

      {error && (
        <div className="new-area-error-message">
          {error}
          <button 
            className="new-area-close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {successMessage && (
        <div className="new-area-success-message">
          {successMessage}
          <button 
            className="new-area-close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      <form className="new-area-form" onSubmit={handleSubmit}>
        <div className="new-area-form-group">
          <label htmlFor="district">
            <img src={districtIcon} alt="Quận" />
            Quận
          </label>
          <input
            type="text"
            id="district"
            name="district"
            value={areaData.district}
            onChange={handleChange}
            required
            placeholder="Nhập tên quận"
          />
        </div>

        <div className="new-area-form-group">
          <label htmlFor="city">
            <img src={cityIcon} alt="Thành phố" />
            Thành phố
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={areaData.city}
            onChange={handleChange}
            required
            placeholder="Nhập tên thành phố"
          />
        </div>

        <div className="new-area-form-actions">
          <button type="submit" className="new-area-submit-button">
            Tạo khu vực
          </button>
          <button 
            type="button" 
            className="new-area-cancel-button"
            onClick={() => navigate('/dashboard/admin/areas')}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewArea; 