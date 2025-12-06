import React from 'react';
import { LoginLayout } from '~/features/auth';
import { PublicRoute } from '~/components/RouteGuard';

const Login = () => {
    return (
        <PublicRoute>
            <LoginLayout />
        </PublicRoute>
    );
};

export default Login;
