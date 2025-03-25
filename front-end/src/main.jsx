import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setupAxiosInterceptors } from './utils/tokenHelper'
import { refreshTokenAPI } from './api/accounts/AuthsAPI'

// setup axios interceptors when app starts
// pass refreshTokenAPI to be able to refresh token when needed
setupAxiosInterceptors(refreshTokenAPI);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
