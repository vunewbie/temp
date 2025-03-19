import React from 'react';
import './Delivery.css';

const Delivery = () => {
  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h1>Giao Hàng</h1>
        <p className="subtitle">Đặt món ăn yêu thích và chúng tôi sẽ giao đến tận nơi</p>
      </div>

      <div className="delivery-content">
        <div className="delivery-info">
          <h2>Thông Tin Giao Hàng</h2>
          <ul className="delivery-list">
            <li>
              <strong>Thời gian giao hàng:</strong> 30-45 phút (tùy khu vực)
            </li>
            <li>
              <strong>Phí giao hàng:</strong> Miễn phí cho đơn hàng từ 200.000đ
            </li>
            <li>
              <strong>Khu vực giao hàng:</strong> Nội thành TP.HCM
            </li>
            <li>
              <strong>Đặt hàng qua:</strong> Website, Hotline: 0123 456 789
            </li>
          </ul>
        </div>

        <div className="delivery-steps">
          <h2>Quy Trình Đặt Hàng</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Chọn Món</h3>
              <p>Lựa chọn món ăn yêu thích từ thực đơn của chúng tôi</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Đặt Hàng</h3>
              <p>Điền thông tin giao hàng và phương thức thanh toán</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Xác Nhận</h3>
              <p>Chúng tôi sẽ gọi điện xác nhận đơn hàng của bạn</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Giao Hàng</h3>
              <p>Shipper sẽ giao món ăn đến địa chỉ của bạn</p>
            </div>
          </div>
        </div>

        <div className="delivery-cta">
          <h2>Đặt Hàng Ngay</h2>
          <p>Xem thực đơn và đặt món ăn yêu thích của bạn</p>
          <a href="/menu" className="order-button">Xem Thực Đơn</a>
        </div>
      </div>
    </div>
  );
};

export default Delivery; 