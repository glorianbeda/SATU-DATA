import React from 'react';
import { Navigate } from 'react-router-dom';

const InventoryShopRedirect = () => {
  return <Navigate to="/inventory/loans/my-loans" replace />;
};

export default InventoryShopRedirect;
