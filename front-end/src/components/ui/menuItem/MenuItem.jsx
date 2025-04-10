import React from 'react';
import './MenuItem.css';

const MenuItem = ({ dish }) => {
  const { name, price, image, status } = dish;
  
  return (
    <div className="menu-item-container">
      <div className="menu-item-image">
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <div className="menu-item-image-placeholder">Hình ảnh món ăn</div>
        )}
        {status === 'hot' && <span className="menu-item-badge hot">Hot</span>}
        {status === 'new' && <span className="menu-item-badge new">New</span>}
        {status === 'promotion' && <span className="menu-item-badge promotion">Khuyến mãi</span>}
      </div>
      
      <div className="menu-item-content">
        <div className="menu-item-name">
          <h3>{name}</h3>
        </div>
        
        <div className="menu-item-price">
          <span>{new Intl.NumberFormat('vi-VN').format(price)} VNĐ</span>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
