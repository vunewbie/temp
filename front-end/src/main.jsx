import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setupAxiosInterceptors } from './utils/tokenHelper'
import { refreshTokenAPI } from './api/Auths'

// Thiết lập axios interceptors khi ứng dụng khởi chạy
// Truyền hàm refreshTokenAPI vào để có thể làm mới token khi cần
setupAxiosInterceptors(refreshTokenAPI);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
