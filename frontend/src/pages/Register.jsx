import React from 'react';
import Auth from './Auth';
import { PublicRoute } from '~/components/RouteGuard';

const Register = () => {
  return (
    <PublicRoute>
      <Auth initialIsLogin={false} />
    </PublicRoute>
  );
};

export default Register;
