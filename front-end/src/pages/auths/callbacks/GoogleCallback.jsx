import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './OAuthCallback.css';

const GoogleCallback = () => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const isCallbackProcessed = useRef(false); // Sử dụng useRef thay vì useState để tránh re-render
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleLogin } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Nếu đã xử lý rồi thì không làm gì cả
      if (isCallbackProcessed.current) return;
      
      try {
        isCallbackProcessed.current = true; // Đánh dấu đã xử lý
        
        // Lấy code từ URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          setError('Không nhận được mã xác thực từ Google');
          setIsProcessing(false);
          return;
        }
                
        // Gọi hàm xử lý đăng nhập từ AuthContext
        await handleGoogleLogin(code);
        
        // Nếu thành công, chuyển hướng về trang chủ
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Lỗi OAuth với Google:', err);
        console.error('Chi tiết response:', err.response?.data);
        setError(err.response?.data?.detail || err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        setIsProcessing(false);
        
        // Chuyển hướng về trang đăng nhập sau một khoảng thời gian
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
    
    // Cleanup function khi component unmount
    return () => {
      isCallbackProcessed.current = true; // Đảm bảo không tiếp tục xử lý nếu component unmount
    };
  }, [location, navigate, handleGoogleLogin]);

  if (error) {
    return (
      <div className="oauth-callback-container oauth-error">
        <h2>Lỗi Xác Thực</h2>
        <p>{error}</p>
        <p>Đang chuyển hướng về trang đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="oauth-callback-container">
      <div className="oauth-loading">
        <div className="oauth-spinner"></div>
        <h2>Đang xử lý đăng nhập...</h2>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 