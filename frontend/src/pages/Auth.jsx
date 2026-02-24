import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import LottiePlayer from '~/components/LottiePlayer';
import loginAnimation from '~/../public/login-animation.json';
import omkLogo from '~/../public/logo-omk-transparent.svg';

const Auth = ({ initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const { t  } = useTranslation();

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  // Improved animation variants with smoother transitions - fade and slide
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const direction = isLogin ? -1 : 1;

  return (
    <div className="min-h-screen w-full">
      {/* Mobile Layout - Form Only */}
      <div className="md:hidden flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Simple decorative circles and dots with animation - VISIBLE */}
        {/* Large circles in corners */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" style={{ zIndex: 0 }}></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/20 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ zIndex: 0, animationDelay: '1s' }}></div>
        
        {/* Small dots - more visible */}
        <div className="absolute top-16 right-12 w-3 h-3 bg-blue-400/50 rounded-full"></div>
        <div className="absolute top-28 left-8 w-3 h-3 bg-blue-400/50 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-4 h-4 bg-blue-400/50 rounded-full"></div>
        <div className="absolute bottom-20 left-12 w-3 h-3 bg-blue-400/50 rounded-full"></div>
        <div className="absolute top-1/2 left-6 w-3 h-3 bg-blue-400/50 rounded-full"></div>
        
        {/* Rectangle patterns - more visible */}
        <div className="absolute top-20 left-1/3 w-8 h-5 bg-blue-400/30 rounded-lg rotate-12 animate-pulse" style={{ zIndex: 0, animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-28 right-1/4 w-6 h-4 bg-blue-400/30 rounded-lg -rotate-6 animate-pulse" style={{ zIndex: 0, animationDelay: '0.8s' }}></div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative" style={{ zIndex: 10 }}>
          {/* Mobile Logo with elegant rounded rectangle background */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {/* Elegant rounded rectangle background - horizontal rectangle */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gradient-to-r from-blue-500 to-indigo-700 rounded-lg blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-lg px-3 py-1.5 shadow-lg border border-gray-100">
                <img 
                  src={omkLogo} 
                  alt="OMK Logo" 
                  className="w-20 h-12 object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t('app_name')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('created_by_omk')}
            </p>
          </div>

          {/* Welcome Header */}
          <div className="mb-6 text-center relative">
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              key={isLogin ? 'login-title' : 'register-title'}
            >
              {isLogin ? t('welcome') : t('register')}
            </motion.h2>
            <motion.p 
              className="text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {isLogin ? t('subtitle') : t('register_subtitle')}
            </motion.p>
          </div>

          {/* Toggle Tabs with improved animation */}
          <div className="flex mb-6 bg-gray-200/80 backdrop-blur-sm rounded-full p-1 w-full max-w-sm relative overflow-hidden shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login-tab' : 'register-tab'}
                initial={{ x: isLogin ? -100 : 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isLogin ? 100 : -100, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md ${
                  isLogin ? 'left-1' : 'left-[calc(50%+4px)]'
                }`}
                style={{ transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </AnimatePresence>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
                isLogin ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
                !isLogin ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('register')}
            </button>
          </div>

          <div className="w-full max-w-sm">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 200, damping: 25 },
                  opacity: { duration: 0.3 },
                }}
                className="w-full bg-white rounded-3xl shadow-xl p-6"
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

      {/* Desktop Layout - Split View with Lottie */}
      <div className="hidden md:flex min-h-screen">
        {/* Left Side - Lottie Animation & Branding */}
        <div className="w-5/12 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-shrink-0 overflow-hidden">
          {/* Lottie Animation Background */}
          <div className="absolute inset-0 opacity-30">
            <LottiePlayer 
              animationData={loginAnimation} 
              className="w-full h-full"
              loop={true}
              autoplay={true}
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/40"></div>

          {/* Decorative floating shapes for visual interest */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full text-white p-8 h-full">
            {/* Logo with elegant rounded rectangle background */}
            <div className="mb-8">
              <div className="relative">
                {/* Glow effect behind logo - horizontal rectangle */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-white/20 rounded-lg blur-xl"></div>
                {/* Rounded rectangle background - horizontal */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg px-5 py-2 border border-white/20 shadow-2xl">
                  <img 
                    src={omkLogo} 
                    alt="OMK Logo" 
                    className="w-36 h-20 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
            
            {/* App Name */}
            <motion.h1 
              className="text-5xl font-bold mb-4 text-center tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('app_name')}
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('app_tagline')}
            </motion.p>

            {/* Decorative line */}
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mb-6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            ></motion.div>

            {/* Features highlights */}
            <motion.div 
              className="flex gap-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Aman</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cepat</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Terpercaya</span>
              </div>
            </motion.div>

            {/* Created by text */}
            <motion.p 
              className="text-sm text-blue-200 text-center max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('created_by_omk')}
            </motion.p>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {/* Simple decorative circles and dots with animation - VISIBLE */}
          {/* Large circles in corners */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" style={{ zIndex: 0 }}></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ zIndex: 0, animationDelay: '1s' }}></div>
          
          {/* Medium circles - more visible */}
          <div className="absolute top-1/4 left-8 w-20 h-20 bg-blue-400/30 rounded-full animate-pulse" style={{ zIndex: 0, animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 right-8 w-16 h-16 bg-blue-400/30 rounded-full animate-pulse" style={{ zIndex: 0, animationDelay: '1.5s' }}></div>
          
          {/* Small dots - more visible */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <div className="absolute top-20 left-20 w-3 h-3 bg-blue-400/50 rounded-full"></div>
            <div className="absolute top-40 right-32 w-4 h-4 bg-blue-400/50 rounded-full"></div>
            <div className="absolute top-60 left-1/3 w-3 h-3 bg-blue-400/50 rounded-full"></div>
            <div className="absolute bottom-40 right-20 w-3 h-3 bg-blue-400/50 rounded-full"></div>
            <div className="absolute bottom-20 left-40 w-4 h-4 bg-blue-400/50 rounded-full"></div>
            <div className="absolute top-1/2 left-10 w-3 h-3 bg-blue-400/50 rounded-full"></div>
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-400/50 rounded-full"></div>
          </div>
          
          {/* Rectangle patterns - more visible */}
          <div className="absolute top-24 right-1/4 w-12 h-8 bg-blue-400/30 rounded-lg rotate-12 animate-pulse" style={{ zIndex: 0, animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-10 h-6 bg-blue-400/30 rounded-lg -rotate-6 animate-pulse" style={{ zIndex: 0, animationDelay: '0.8s' }}></div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>

          {/* Toggle Tabs with improved animation */}
          <div className="flex mb-8 bg-gray-200/80 backdrop-blur-sm rounded-full p-1 w-full max-w-sm relative overflow-hidden shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login-tab' : 'register-tab'}
                initial={{ x: isLogin ? -100 : 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isLogin ? 100 : -100, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md ${
                  isLogin ? 'left-1' : 'left-[calc(50%+4px)]'
                }`}
                style={{ transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </AnimatePresence>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
                isLogin ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
                !isLogin ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('register')}
            </button>
          </div>

          <div className="w-full max-w-md">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 200, damping: 25 },
                  opacity: { duration: 0.3 },
                }}
                className="w-full bg-white rounded-3xl shadow-xl p-8"
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
    </div>
  );
};

export default Auth;
