import React from 'react';
import { Navigate } from 'react-router-dom';

const InventoryDashboardRedirect = () => {
  return <Navigate to="/inventory" replace />;
};

export default InventoryDashboardRedirect;
