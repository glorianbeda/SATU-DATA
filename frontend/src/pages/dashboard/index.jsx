import React from 'react';
import { DashboardLayout } from '~/features/dashboard';
import { ProtectedRoute } from '~/components/RouteGuard';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
};

export default Dashboard;
