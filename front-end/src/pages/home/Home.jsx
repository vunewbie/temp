import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { 
  intro1, intro2, intro3, intro4, intro5, intro6,
  hn1, hn2, hn3, hn4, hn5, hn6,
  dn1, dn2, dn3, dn4, dn5, dn6,
  hcm1, hcm2, hcm3, hcm4, hcm5, hcm6
} from '../../assets';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // Tạo mảng introImages từ các ảnh đã import
  const introImages = [intro1, intro2, intro3, intro4, intro5, intro6];

  // Các thông tin chi nhánh
  const branchImages = {
    hanoi: [hn1, hn2, hn3, hn4, hn5, hn6],
    danang: [dn1, dn2, dn3, dn4, dn5, dn6],
    hochiminh: [hcm1, hcm2, hcm3, hcm4, hcm5, hcm6]
  };

  const branchInfo = {
    hanoi: [
      { title: 'Hadu Sushi - Đống Đa', description: 'Số 27 Thái Thịnh, Đống Đa, Hà Nội' },
      { title: 'Kiraku Japanese Restaurant - Hai Bà Trưng', description: '57 Trần Nhật Duật, Hai Bà Trưng, Hà Nội' },
      { title: 'Sushi Bar - Xuân Diệu', description: '5 Xuân Diệu, Tây Hồ, Hà Nội' },
      { title: 'Sushi Kei - Long Biên', description: 'Tầng 3, AEON Mall Long Biên, Long Biên, Hà Nội' },
      { title: 'Sushi Lab - Hoàn Kiếm', description: '34 Lò Sũ, Hoàn Kiếm, Hà Nội' },
      { title: 'Tokyo Deli - Hoàng Đạo Thúy', description: '17T4 Hoàng Đạo Thúy, Cầu Giấy, Hà Nội' }
    ],
    danang: [
      { title: 'Akataiyo Sushi - Hải Châu', description: '12 Bạch Đằng, Hải Châu, Đà Nẵng' },
      { title: 'Chen Sushi - Cẩm Lệ', description: '75 Ông Ích Khiêm, Cẩm Lệ, Đà Nẵng' },
      { title: 'Dasushi - Thanh Khê', description: '83 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng' },
      { title: 'Issun Boshi - Ngũ Hành Sơn', description: 'Lô A5-10 Trần Hưng Đạo, Ngũ Hành Sơn, Đà Nẵng' },
      { title: 'Kyoto Sushi Japanese - Sơn Trà', description: '29 An Dương Vương, Sơn Trà, Đà Nẵng' },
      { title: 'Little Tokyo - Ngũ Hành Sơn', description: 'Lô 2 Đường Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng' }
    ],
    hochiminh: [
      { title: 'Kyo Sushi - Quận 8', description: '436 Âu Dương Lân, Phường 3, Quận 8, TP HCM' },
      { title: 'La Phong Sushi House - Quận 1', description: '121 Lý Tự Trọng, Bến Thành, Quận 1, TP HCM' },
      { title: 'Sorae Sushi - Quận 1', description: 'Tầng 24-25, AB Tower, 76A Lê Lai, Quận 1, TP HCM' },
      { title: 'Sushi Tei - Quận 3', description: '97 Võ Văn Tần, Phường 6, Quận 3, TP HCM' },
      { title: 'Sushiway - Thủ Đức', description: 'Lầu 3, Vincom Thủ Đức, 216 Võ Văn Ngân, TP Thủ Đức, TP HCM' },
      { title: 'Takashi Sushi - Bình Chánh', description: '23 Nguyễn Hữu Trí, Bình Chánh, TP HCM' }
    ]
  };

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