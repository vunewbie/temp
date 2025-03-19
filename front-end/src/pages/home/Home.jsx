import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { introImages, branchImages, branchInfo } from '../../utils/imageLoader';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % introImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % introImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + introImages.length) % introImages.length);
  };

  const openImageModal = (image, info) => {
    setSelectedImage({ src: image, ...info });
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="home">
      <section className="home-banner">
        <div className="banner-grid">
          <div className="slideshow-container">
            {introImages.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide})` }}
              />
            ))}
            <button className="slide-arrow prev" onClick={prevSlide}>
              <FaArrowLeft />
            </button>
            <button className="slide-arrow next" onClick={nextSlide}>
              <FaArrowRight />
            </button>
            <div className="slide-indicators">
              {introImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          <div className="banner-content">
            <h1>Chào mừng đến với Vunewbie Restaurant</h1>
            <div className="banner-features">
              <div className="feature">
                <h3>Món Ăn Đặc Sắc</h3>
                <p>Thực đơn phong phú với hơn 100 món ăn truyền thống và hiện đại</p>
              </div>
              <div className="feature">
                <h3>Không Gian Sang Trọng</h3>
                <p>Thiết kế hiện đại, ấm cúng phù hợp mọi dịp</p>
              </div>
              <div className="feature">
                <h3>Dịch Vụ Chuyên Nghiệp</h3>
                <p>Đội ngũ nhân viên tận tâm, chu đáo</p>
              </div>
            </div>
            <div className="banner-cta">
              <Link to="/menu" className="cta-button">Xem Thực Đơn</Link>
              <Link to="/reservation" className="cta-button outline">Đặt Bàn Ngay</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Branches section */}
      <section className="branches-section">
        {/* Hà Nội */}
        <div className="city-branch">
          <h2>Chi Nhánh Hà Nội</h2>
          <div className="branch-grid">
            {branchImages.hanoi.map((image, index) => (
              <div 
                key={index} 
                className="branch-item" 
                onClick={() => openImageModal(image, branchInfo.hanoi[index])}
              >
                <div 
                  className="branch-image" 
                  style={{ backgroundImage: `url(${image})` }}
                />
                <h3>{branchInfo.hanoi[index].title}</h3>
                <p>{branchInfo.hanoi[index].description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Đà Nẵng */}
        <div className="city-branch">
          <h2>Chi Nhánh Đà Nẵng</h2>
          <div className="branch-grid">
            {branchImages.danang.map((image, index) => (
              <div 
                key={index} 
                className="branch-item" 
                onClick={() => openImageModal(image, branchInfo.danang[index])}
              >
                <div 
                  className="branch-image" 
                  style={{ backgroundImage: `url(${image})` }}
                />
                <h3>{branchInfo.danang[index].title}</h3>
                <p>{branchInfo.danang[index].description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hồ Chí Minh */}
        <div className="city-branch">
          <h2>Chi Nhánh Hồ Chí Minh</h2>
          <div className="branch-grid">
            {branchImages.hochiminh.map((image, index) => (
              <div 
                key={index} 
                className="branch-item" 
                onClick={() => openImageModal(image, branchInfo.hochiminh[index])}
              >
                <div 
                  className="branch-image" 
                  style={{ backgroundImage: `url(${image})` }}
                />
                <h3>{branchInfo.hochiminh[index].title}</h3>
                <p>{branchInfo.hochiminh[index].description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <button className="modal-close" onClick={closeImageModal}>
            <FaTimes />
          </button>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.title} />
            <div className="modal-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 