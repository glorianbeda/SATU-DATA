import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PageLoader from './PageLoader';

/**
 * ProtectedRoute - Requires valid auth session (cookie)
 * Redirects to /login if session is invalid
 */
export const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const validateSession = async () => {
      try {
        // Validate session by calling profile endpoint with credentials (cookies)
        await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          withCredentials: true
        });
        setIsValid(true);
      } catch (error) {
        // Session invalid or expired
        localStorage.removeItem('user'); // Clear user data if any
        setIsValid(false);
      }
    };

    validateSession();
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
      try {
        // Check if session is valid
        await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          withCredentials: true
        });
        setIsLoggedIn(true);
      } catch (error) {
        // Not logged in
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
      try {
        // Validate session and get user role
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          withCredentials: true
        });
        
        const userRole = response.data.user.role?.name || response.data.user.role;
        
        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        // Session invalid or network error
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
