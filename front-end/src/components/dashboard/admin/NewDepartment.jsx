import React, { useState } from 'react';
import { createDepartmentAPI } from '../../../api/establishments/DepartmentAPI';
import { departmentIcon, salaryIcon } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import './NewDepartment.css';

const NewDepartment = () => {
  const navigate = useNavigate();
  const [departmentData, setDepartmentData] = useState({
    name: '',
    salary: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await createDepartmentAPI(departmentData);
      setSuccessMessage('Tạo bộ phận mới thành công!');
      setTimeout(() => {
        // refresh page
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Lỗi khi tạo bộ phận:', err);
      setError(err.response?.data?.detail || 'Có lỗi xảy ra khi tạo bộ phận');
    }
  };

  return (
    <div className="new-department-container">
      <h2>Tạo bộ phận mới</h2>

      {error && (
        <div className="new-department-error-message">
          {error}
          <button 
            className="new-department-close-button" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}

      {successMessage && (
        <div className="new-department-success-message">
          {successMessage}
          <button 
            className="new-department-close-button" 
            onClick={() => setSuccessMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      <form className="new-department-form" onSubmit={handleSubmit}>
        <div className="new-department-form-group">
          <label htmlFor="name">
            <img src={departmentIcon} alt="Tên bộ phận" />
            Tên bộ phận
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={departmentData.name}
            onChange={handleChange}
            required
            placeholder="Nhập tên bộ phận"
          />
        </div>

        <div className="new-department-form-group">
          <label htmlFor="salary">
            <img src={salaryIcon} alt="Lương" />
            Lương
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={departmentData.salary}
            onChange={handleChange}
            required
            min="0"
            placeholder="Nhập mức lương"
          />
        </div>

        <div className="new-department-form-actions">
          <button type="submit" className="new-department-submit-button">
            Tạo bộ phận
          </button>
          <button 
            type="button" 
            className="new-department-cancel-button"
            onClick={() => navigate('/dashboard/admin/departments')}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDepartment; 