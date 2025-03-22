// Libraries
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// CSS
import './App.css';
// Components
import { Header, Footer } from './components';
// Routes
import { AdminRoute, ManagerRoute, EmployeeRoute, CustomerRoute } from './routes';
// Main Pages
import { Home, About, Menu, Reservation, Delivery, Promotions, Reviews, Login, CustomerRegister} from './pages';
// Auth Pages
import { VerifyOTP, ForgotPassword, ResetPassword, GoogleCallback, FacebookCallback, GitHubCallback } from './pages';
// Terms Pages
import { TermsOfUse, PrivacyPolicy, MembershipPolicy } from './pages';
// Dashboard Pages
import CustomerDashboard from './pages/dashboard/customer/CustomerDashboard';
import ManagerDashboard from './pages/dashboard/manager/ManagerDashboard';
import EmployeeDashboard from './pages/dashboard/employee/EmployeeDashboard';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
// Auth Provider
import { AuthProvider } from './context/AuthContext';
// Scroll To Top
import { ScrollToTop } from './components';

const App = () => {
  return (
    <>
      {/* Nút cuộn lên đầu trang - đặt ở ngoài Router */}
      <ScrollToTop />
      
      <Router>
        <AuthProvider>
          <div className="app-container">
            <Header />
            
            <main className="main-content">
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<CustomerRegister />} />

                {/* Auth Pages */}
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<div className="page-container text-center">Bạn không có quyền truy cập trang này</div>} />
                
                {/* OAuth Callback Routes */}
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/auth/facebook/callback" element={<FacebookCallback />} />
                <Route path="/auth/github/callback" element={<GitHubCallback />} />

                {/* Terms Pages */}
                <Route path="/terms/use" element={<TermsOfUse />} />
                <Route path="/terms/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms/membership" element={<MembershipPolicy />} />

                {/* Dashboard Pages */}
                <Route path="/dashboard/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/dashboard/manager" element={
                  <ManagerRoute>
                    <ManagerDashboard />
                  </ManagerRoute>
                } />
                <Route path="/dashboard/employee" element={
                  <EmployeeRoute>
                    <EmployeeDashboard />
                  </EmployeeRoute>
                } />
                <Route path="/dashboard/customer" element={
                  <CustomerRoute>
                    <CustomerDashboard />
                  </CustomerRoute>
                } />
                
                {/* 404 Page */}
                <Route path="*" element={<div className="page-container text-center">Không tìm thấy trang</div>} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
