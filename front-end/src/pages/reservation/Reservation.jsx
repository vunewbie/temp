import React, { useState } from 'react';
import './Reservation.css';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // set is submitted to true
    setIsSubmitted(true);
  };

  // create options for guest number
  const guestOptions = [];
  for (let i = 1; i <= 10; i++) {
    guestOptions.push(
      <option key={i} value={i}>{i} người</option>
    );
  }
  guestOptions.push(<option key="more" value="more">Hơn 10 người</option>);

  // create options for time
  const timeOptions = [];
  for (let hour = 10; hour <= 21; hour++) {
    timeOptions.push(
      <option key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</option>
    );
    if (hour < 21) {
      timeOptions.push(
        <option key={`${hour}:30`} value={`${hour}:30`}>{`${hour}:30`}</option>
      );
    }
  }

  // get today's date to limit booking date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <h1>Đặt Bàn</h1>
        <p className="subtitle">Đặt bàn trước để có trải nghiệm tốt nhất</p>
      </div>

      <div className="reservation-content">
        <div className="reservation-info">
          <h2>Thông Tin Đặt Bàn</h2>
          <p>
            Quý khách vui lòng điền đầy đủ thông tin để đặt bàn. Chúng tôi sẽ liên hệ lại để xác nhận.
          </p>
          <div className="reservation-details">
            <div className="detail-item">
              <i className="icon time-icon"></i>
              <div>
                <h3>Giờ Mở Cửa</h3>
                <p>10:00 - 22:00 hàng ngày</p>
              </div>
            </div>
            <div className="detail-item">
              <i className="icon phone-icon"></i>
              <div>
                <h3>Liên Hệ</h3>
                <p>0123 456 789</p>
              </div>
            </div>
            <div className="detail-item">
              <i className="icon location-icon"></i>
              <div>
                <h3>Địa Chỉ</h3>
                <p>123 Đường ABC, Quận XYZ, TP.HCM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="reservation-form-container">
          {isSubmitted ? (
            <div className="success-message">
              <h2>Đặt Bàn Thành Công!</h2>
              <p>Cảm ơn quý khách đã đặt bàn tại Vunewbie Restaurant. Chúng tôi sẽ liên hệ lại để xác nhận trong thời gian sớm nhất.</p>
              <button 
                className="new-reservation-button"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    date: '',
                    time: '',
                    guests: '2',
                    notes: ''
                  });
                }}
              >
                Đặt Bàn Mới
              </button>
            </div>
          ) : (
            <form className="reservation-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Họ và Tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số Điện Thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Ngày *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={today}
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Giờ *</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn giờ</option>
                    {timeOptions}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guests">Số Lượng Khách *</label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                >
                  {guestOptions}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Ghi Chú</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Yêu cầu đặc biệt, ví dụ: bàn gần cửa sổ, ghế cho trẻ em..."
                ></textarea>
              </div>

              <button type="submit" className="submit-button">Đặt Bàn</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservation; 