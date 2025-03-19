import React, { useState } from 'react';
import './Menu.css';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất Cả' },
    { id: 'appetizer', name: 'Khai Vị' },
    { id: 'main', name: 'Món Chính' },
    { id: 'dessert', name: 'Tráng Miệng' },
    { id: 'drink', name: 'Đồ Uống' }
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Gỏi Cuốn Tôm Thịt',
      description: 'Gỏi cuốn tươi với tôm, thịt heo, bún và rau thơm',
      price: '65.000',
      category: 'appetizer',
      image: 'placeholder'
    },
    {
      id: 2,
      name: 'Chả Giò Hải Sản',
      description: 'Chả giò giòn rụm với nhân hải sản thơm ngon',
      price: '75.000',
      category: 'appetizer',
      image: 'placeholder'
    },
    {
      id: 3,
      name: 'Bò Lúc Lắc',
      description: 'Thịt bò xào với ớt chuông và các loại gia vị đặc biệt',
      price: '150.000',
      category: 'main',
      image: 'placeholder'
    },
    {
      id: 4,
      name: 'Cá Hồi Nướng Miso',
      description: 'Cá hồi tươi nướng với sốt miso truyền thống',
      price: '180.000',
      category: 'main',
      image: 'placeholder'
    },
    {
      id: 5,
      name: 'Bánh Flan Caramel',
      description: 'Bánh flan mềm mịn với lớp caramel ngọt ngào',
      price: '45.000',
      category: 'dessert',
      image: 'placeholder'
    },
    {
      id: 6,
      name: 'Chè Hạt Sen',
      description: 'Chè hạt sen thơm ngon với nước cốt dừa',
      price: '40.000',
      category: 'dessert',
      image: 'placeholder'
    },
    {
      id: 7,
      name: 'Sinh Tố Xoài',
      description: 'Sinh tố xoài tươi ngon với đá xay mịn',
      price: '55.000',
      category: 'drink',
      image: 'placeholder'
    },
    {
      id: 8,
      name: 'Trà Sen Vàng',
      description: 'Trà thơm với hương sen tinh tế',
      price: '45.000',
      category: 'drink',
      image: 'placeholder'
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Thực Đơn</h1>
        <p className="subtitle">Khám phá các món ăn đặc sắc của chúng tôi</p>
      </div>

      <div className="menu-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-items">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item">
            <div className={`menu-item-image ${item.image}`}></div>
            <div className="menu-item-content">
              <div className="menu-item-header">
                <h3>{item.name}</h3>
                <span className="menu-item-price">{item.price} VNĐ</span>
              </div>
              <p className="menu-item-description">{item.description}</p>
              <button className="order-button">Đặt Món</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu; 