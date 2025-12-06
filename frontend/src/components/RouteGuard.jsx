import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PageLoader from './PageLoader';

/**
 * ProtectedRoute - Requires valid auth token
 * Redirects to /login if no token or invalid token
 */
export const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        // Validate token by calling profile endpoint
        await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(true);
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) {
    return <PageLoader />;
  }

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * PublicRoute - For login/register pages
 * Redirects to /dashboard if user is already logged in
 */
export const PublicRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        // Validate token
        await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLoggedIn(true);
      } catch (error) {
        // Token invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return <PageLoader />;
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        // Validate token and get user role
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userRole = response.data.user.role?.name || response.data.user.role;
        
        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        // Token invalid or network error
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (isAuthorized === null) {
    return <PageLoader />;
  }

  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
