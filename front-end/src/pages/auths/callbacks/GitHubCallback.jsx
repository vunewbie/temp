import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './OAuthCallback.css';

const GitHubCallback = () => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const isCallbackProcessed = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGitHubLogin } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // if callback already processed, do nothing
      if (isCallbackProcessed.current) return;
      
      try {
        isCallbackProcessed.current = true;
        
        // get code from url query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          setError('Không nhận được mã xác thực từ GitHub');
          setIsProcessing(false);
          return;
        }
                
        // call login handler from AuthContext
        await handleGitHubLogin(code);
        
        // if success, redirect to home page
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Lỗi OAuth với GitHub:', err);
        console.error('Chi tiết response:', err.response?.data);
        setError(err.response?.data?.detail || err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        setIsProcessing(false);
        
        // redirect to login page after a while
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
    
    // cleanup function when component unmount
    return () => {
      isCallbackProcessed.current = true;
    };
  }, [location, navigate, handleGitHubLogin]);

  if (error) {
    return (
      <div className="oauth-callback-container">
        <div className="oauth-error">
          <h2>Lỗi Xác Thực</h2>
          <p>Đã xảy ra lỗi khi đăng nhập bằng GitHub:</p>
          <p><code>{error}</code></p>
          <p>Đang chuyển hướng về trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="oauth-callback-container">
      <div className="oauth-loading">
        <div className="oauth-spinner"></div>
        <h3>Đang xử lý đăng nhập...</h3>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
};

export default GitHubCallback; 