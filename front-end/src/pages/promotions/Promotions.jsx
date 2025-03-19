import React from 'react';
import './Promotions.css';

const Promotions = () => {
  const promotions = [
    {
      id: 1,
      title: 'Khuyến Mãi Sinh Nhật',
      description: 'Giảm 20% tổng hóa đơn cho khách hàng đang có sinh nhật (áp dụng khi đặt bàn trước và mang theo CMND/CCCD).',
      validUntil: '31/12/2024',
      image: 'placeholder'
    },
    {
      id: 2,
      title: 'Combo Gia Đình',
      description: 'Combo dành cho 4 người chỉ với 499.000đ (tiết kiệm 15%). Bao gồm 2 món khai vị, 2 món chính, 1 món tráng miệng và 4 đồ uống.',
      validUntil: '30/06/2024',
      image: 'placeholder'
    },
    {
      id: 3,
      title: 'Happy Hour',
      description: 'Giảm 30% tất cả đồ uống từ 14:00 - 17:00 các ngày trong tuần.',
      validUntil: '31/05/2024',
      image: 'placeholder'
    },
    {
      id: 4,
      title: 'Ưu Đãi Thành Viên Mới',
      description: 'Đăng ký thành viên mới và nhận ngay voucher giảm 15% cho lần đầu sử dụng dịch vụ.',
      validUntil: '31/12/2024',
      image: 'placeholder'
    }
  ];

  return (
    <div className="promotions-container">
      <div className="promotions-header">
        <h1>Ưu Đãi</h1>
        <p className="subtitle">Khám phá các chương trình khuyến mãi hấp dẫn</p>
      </div>

      <div className="promotions-list">
        {promotions.map(promo => (
          <div key={promo.id} className="promotion-card">
            <div className={`promotion-image ${promo.image}`}></div>
            <div className="promotion-content">
              <h2>{promo.title}</h2>
              <p className="promotion-description">{promo.description}</p>
              <p className="promotion-validity">Có hiệu lực đến: {promo.validUntil}</p>
              <button className="use-promotion-button">Sử Dụng Ngay</button>
            </div>
          </div>
        ))}
      </div>

      <div className="membership-section">
        <h2>Chương Trình Thành Viên</h2>
        <p>Đăng ký làm thành viên để nhận thêm nhiều ưu đãi hấp dẫn:</p>
        <ul className="membership-benefits">
          <li>Tích điểm với mỗi đơn hàng</li>
          <li>Ưu đãi sinh nhật đặc biệt</li>
          <li>Thông báo sớm về các chương trình khuyến mãi</li>
          <li>Quà tặng độc quyền cho thành viên</li>
        </ul>
        <a href="/login" className="register-button">Đăng Ký Ngay</a>
      </div>
    </div>
  );
};

export default Promotions; 