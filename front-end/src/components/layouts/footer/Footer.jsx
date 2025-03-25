import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { 
  footerFacebookIcon, 
  footerInstagramIcon, 
  footerTiktokIcon, 
  footerYoutubeIcon, 
  boCongThuongIcon 
} from '../../../assets';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column map-column">
          <h3 className="footer-title">Bản Đồ</h3>
          <div className="footer-map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.9675124302795!2d106.59290937584518!3d11.20983288934868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310b6d52e7c34d0d%3A0xbab7a6a3c3f083c5!2zTOG7mWMgTmluaCwgQsOsbmggUGjGsOG7m2M!5e0!3m2!1svi!2svn!4v1710661234567!5m2!1svi!2svn" 
              width="100%" 
              height="200" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Địa chỉ nhà hàng"
              className="footer-map"
            ></iframe>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">CÔNG TY TNHH MTV VUNEWBIE</h3>
          <ul className="footer-info-list">
            <li className="footer-info-item">
              <span className="footer-info-label">Mã Số Thuế:</span> 8883898250
            </li>
            <li className="footer-info-item">
              <span className="footer-info-label">Người Đại Diện:</span> Nguyễn Hoàng Vũ
            </li>
            <li className="footer-info-item">
              <span className="footer-info-label">Địa Chỉ:</span> 447, quốc lộ 13, khu phố Ninh Thái, thị trấn Lộc Ninh, huyện Lộc Ninh, tỉnh Bình Phước
            </li>
            <li className="footer-info-item">
              <span className="footer-info-label">Hotline:</span> 0386323603
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Thông Tin Điều Khoản</h3>
          <ul className="footer-links-list">
            <li className="footer-link-item">
              <Link to="/terms/use" className="footer-link">Điều Khoản Sử Dụng</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/terms/privacy" className="footer-link">Chính Sách Bảo Mật</Link>
            </li>
            <li className="footer-link-item">
              <Link to="/terms/membership" className="footer-link">Chính Sách Thành Viên</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Mạng Xã Hội</h3>
          <div className="footer-social">
            <div className="footer-social-row">
              <a 
                href="https://www.facebook.com/vu.nguyen.hoang.86543" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <img src={footerFacebookIcon} alt="Facebook" className="footer-social-icon" />
              </a>
              <a 
                href="https://www.instagram.com/_nhv_04/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <img src={footerInstagramIcon} alt="Instagram" className="footer-social-icon" />
              </a>
            </div>
            <div className="footer-social-row">
              <a 
                href="https://www.tiktok.com/@sapthatnghiephuhu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <img src={footerTiktokIcon} alt="TikTok" className="footer-social-icon" />
              </a>
              <a 
                href="https://www.youtube.com/@vunguyenhoang7831" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <img src={footerYoutubeIcon} alt="YouTube" className="footer-social-icon" />
              </a>
            </div>
            <div className="footer-social-row">
              <a 
                href="http://online.gov.vn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-link bo-cong-thuong"
              >
                <img 
                  src={boCongThuongIcon} 
                  alt="Bộ Công Thương" 
                  className="footer-bo-cong-thuong" 
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} VUNEWBIE. Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
