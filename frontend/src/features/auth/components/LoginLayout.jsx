import React from 'react';
import { useTranslation } from 'react-i18next';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LottiePlayer from '~/components/LottiePlayer';
import loginAnimation from '~/../public/login-animation.json';
import omkLogo from '~/../public/logo-omk.png';

const LoginLayout = () => {
    const { t } = useTranslation();
    const [isRegister, setIsRegister] = React.useState(false);

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Lottie Animation & Branding */}
            <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-shrink-0 overflow-hidden">
                {/* Lottie Animation Background */}
                <div className="absolute inset-0 opacity-30">
                    <LottiePlayer 
                        animationData={loginAnimation} 
                        className="w-full h-full"
                        loop={true}
                        autoplay={true}
                    />
                </div>

                {/* Overlay gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/40"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full text-white p-12">
                    {/* Logo */}
                    <div className="mb-6">
                        <img 
                            src={omkLogo} 
                            alt="OMK Logo" 
                            className="w-32 h-32 object-contain drop-shadow-2xl"
                        />
                    </div>
                    
                    {/* App Name */}
                    <h1 className="text-5xl font-bold mb-4 text-center tracking-tight">
                        {t('app_name')}
                    </h1>
                    <p className="text-xl text-blue-100 mb-6 text-center">
                        {t('app_tagline')}
                    </p>

                    {/* Decorative line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mb-6"></div>

                    {/* Created by text */}
                    <p className="text-sm text-blue-200 text-center max-w-xs">
                        {t('created_by_omk')}
                    </p>
                </div>
            </div>

            {/* Right Side - Login/Register Form */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8 min-h-screen">
                <div className="w-full max-w-md">
                    {/* Mobile Logo - Visible only on small screens */}
                    <div className="lg:hidden flex flex-col items-center mb-8">
                        <img 
                            src={omkLogo} 
                            alt="OMK Logo" 
                            className="w-24 h-24 object-contain mb-4"
                        />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {t('app_name')}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('created_by_omk')}
                        </p>
                    </div>

                    {/* Form Toggle */}
                    <div className="flex mb-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                        <button
                            onClick={() => setIsRegister(false)}
                            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                                !isRegister 
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300'
                            }`}
                        >
                            {t('login')}
                        </button>
                        <button
                            onClick={() => setIsRegister(true)}
                            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                                isRegister 
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300'
                            }`}
                        >
                            {t('register')}
                        </button>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        {isRegister ? (
                            <RegisterForm onSwitch={() => setIsRegister(false)} />
                        ) : (
                            <LoginForm onSwitch={() => setIsRegister(true)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginLayout;
