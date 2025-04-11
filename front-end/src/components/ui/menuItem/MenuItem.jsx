import React from 'react';
import './MenuItem.css';
import { IoRestaurantOutline } from 'react-icons/io5';

const MenuItem = ({ dish }) => {
  const { name, price, image, status } = dish;
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="menu-item-container">
      <div className="menu-item-image">
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <div className="menu-item-image-placeholder">
            <IoRestaurantOutline size={36} />
            <span>Chưa có hình ảnh</span>
          </div>
        )}
        {status === 'hot' && <span className="menu-item-badge hot">Hot</span>}
        {status === 'new' && <span className="menu-item-badge new">New</span>}
        {status === 'promotion' && <span className="menu-item-badge promotion">Sale</span>}
      </div>
      
      <div className="menu-item-content">
        <div className="menu-item-name">
          <h3>{name}</h3>
        </div>
        
        <div className="menu-item-price">
          <span>{formatPrice(price)}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
