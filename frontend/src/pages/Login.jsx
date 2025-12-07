import React from 'react';
import Auth from './Auth';
import { PublicRoute } from '~/components/RouteGuard';

const Login = () => {
  return (
    <PublicRoute>
      <Auth initialIsLogin={true} />
    </PublicRoute>
  );
};

export default Login;
