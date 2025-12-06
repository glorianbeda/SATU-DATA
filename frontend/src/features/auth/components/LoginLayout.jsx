import React from 'react';
import { useTranslation } from 'react-i18next';
import loginImage from '~/assets/image.png';
import LoginForm from './LoginForm';

const LoginLayout = () => {
    const { t } = useTranslation();

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left Side - Image/Branding */}
            {/* Left Side - Image/Branding */}
            <div className="hidden md:flex md:w-5/12 relative bg-gray-900">
                <img
                    src={loginImage}
                    alt="Login Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/70"></div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full text-white p-8 h-full">
                    <h1 className="text-5xl font-bold mb-2">{t('app_name')}</h1>
                    <p className="text-xl">{t('app_tagline')}</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-7/12 flex items-center justify-center bg-white">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginLayout;
