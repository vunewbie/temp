import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// protected route component, only allows access when authenticated
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // if not authenticated, redirect to login page
  if (!isAuthenticated) {
    // save current url to redirect to after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // if there is a role requirement and the user does not have the appropriate role
  if (requiredRole && (!user || user.type !== requiredRole)) {
    // redirect to home page or unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // if authenticated and has the appropriate role, display content
  return children;
};

// define routes based on role
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="A">{children}</ProtectedRoute>
);

export const ManagerRoute = ({ children }) => (
  <ProtectedRoute requiredRole="M">{children}</ProtectedRoute>
);

export const EmployeeRoute = ({ children }) => (
  <ProtectedRoute requiredRole="E">{children}</ProtectedRoute>
);

export const CustomerRoute = ({ children }) => (
  <ProtectedRoute requiredRole="C">{children}</ProtectedRoute>
);

export default ProtectedRoute; 