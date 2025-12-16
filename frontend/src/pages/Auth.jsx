import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import loginImage from '~/assets/image.png';

const Auth = ({ initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const { t } = useTranslation();

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const direction = isLogin ? -1 : 1;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900">
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

        {/* Right Side - Auth Form */}
        <div className="w-full md:w-7/12 flex items-center justify-center bg-white dark:bg-gray-900 relative overflow-hidden">
            <div className="w-full max-w-md p-4">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={isLogin ? 'login' : 'register'}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        style={{ width: '100%' }}
                    >
                        {isLogin ? (
                            <LoginForm onSwitch={toggleAuth} />
                        ) : (
                            <RegisterForm onSwitch={toggleAuth} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
};

export default Auth;
