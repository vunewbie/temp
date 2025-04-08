import React, { useState, useEffect } from 'react';
import { createBranchAPI } from '../../../api/establishments/BranchAPI';
import { listAreaInfoAPI } from '../../../api/establishments/AreaAPI';
import { 
  branchIcon, 
  addressIcon, 
  phoneNumberIcon,
  openingTimeIcon,
  closingTimeIcon,
  carParkingLotIcon,
  motorbikeParkingLotIcon
} from '../../../assets';
import { useNavigate } from 'react-router-dom';
import './NewBranch.css';

const NewBranch = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [branchData, setBranchData] = useState({
    name: '',
    address: '',
    phone_number: '',
    opening_time: '',
    closing_time: '',
    car_parking_lot: false,
    motorbike_parking_lot: false,
    area: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await listAreaInfoAPI();
        setAreas(data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách khu vực:', err);
        setError('Không thể lấy danh sách khu vực');
      }
    };

    fetchAreas();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBranchData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await createBranchAPI(branchData);
      setSuccessMessage('Tạo chi nhánh mới thành công!');
      setTimeout(() => {
        // refresh page
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Lỗi khi tạo chi nhánh:', err);
      setError(err.response?.data?.detail || 'Có lỗi xảy ra khi tạo chi nhánh');
    }
  };

  return (
    <div className="new-branch-container">
      <h2>Tạo chi nhánh mới</h2>

      {error && (
        <div className="new-branch-error-message">
          {error}
          <button 
            className="new-branch-close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {successMessage && (
        <div className="new-branch-success-message">
          {successMessage}
          <button 
            className="new-branch-close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      <form className="new-branch-form" onSubmit={handleSubmit}>
        <div className="new-branch-form-group">
          <label htmlFor="name">
            <img src={branchIcon} alt="Tên chi nhánh" />
            Tên chi nhánh
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={branchData.name}
            onChange={handleChange}
            required
            placeholder="Nhập tên chi nhánh"
          />
        </div>

        <div className="new-branch-form-group">
          <label htmlFor="address">
            <img src={addressIcon} alt="Địa chỉ" />
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={branchData.address}
            onChange={handleChange}
            required
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="new-branch-form-group">
          <label htmlFor="phone_number">
            <img src={phoneNumberIcon} alt="Số điện thoại" />
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={branchData.phone_number}
            onChange={handleChange}
            required
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="new-branch-form-group">
          <label htmlFor="opening_time">
            <img src={openingTimeIcon} alt="Giờ mở cửa" />
            Giờ mở cửa
          </label>
          <input
            type="time"
            id="opening_time"
            name="opening_time"
            value={branchData.opening_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="new-branch-form-group">
          <label htmlFor="closing_time">
            <img src={closingTimeIcon} alt="Giờ đóng cửa" />
            Giờ đóng cửa
          </label>
          <input
            type="time"
            id="closing_time"
            name="closing_time"
            value={branchData.closing_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="new-branch-form-group">
          <label htmlFor="area">
            Khu vực
          </label>
          <select
            id="area"
            name="area"
            value={branchData.area}
            onChange={handleChange}
            required
          >
            <option value="">Chọn khu vực</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.district}, {area.city}
              </option>
            ))}
          </select>
        </div>

        <div className="new-branch-form-group">
          <label className="new-branch-checkbox-label">
            <input
              type="checkbox"
              name="car_parking_lot"
              checked={branchData.car_parking_lot}
              onChange={handleChange}
            />
            <img src={carParkingLotIcon} alt="Bãi đỗ xe ô tô" />
            Bãi đỗ xe ô tô
          </label>
        </div>

        <div className="new-branch-form-group">
          <label className="new-branch-checkbox-label">
            <input
              type="checkbox"
              name="motorbike_parking_lot"
              checked={branchData.motorbike_parking_lot}
              onChange={handleChange}
            />
            <img src={motorbikeParkingLotIcon} alt="Bãi đỗ xe máy" />
            Bãi đỗ xe máy
          </label>
        </div>

        <div className="new-branch-form-actions">
          <button type="submit" className="new-branch-submit-button">
            Tạo chi nhánh
          </button>
          <button 
            type="button" 
            className="new-branch-cancel-button"
            onClick={() => navigate('/dashboard/admin/branches')}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBranch; 