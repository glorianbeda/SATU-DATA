import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import { motion, AnimatePresence } from 'motion/react';

const GlobalLoader = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start loading on location change
    setIsLoading(true);
    NProgress.start();

    // Stop loading after a short delay to allow page to render
    // This gives a smoother feel than instant disappearance
    const timer = setTimeout(() => {
      setIsLoading(false);
      NProgress.done();
    }, 500); // 500ms minimum loading time for smooth transition

    return () => clearTimeout(timer);
  }, [location.pathname]); // Trigger on path change

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 dark:bg-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 rounded-full"
                style={{ borderTopColor: '#3b82f6' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p 
              className="text-gray-500 dark:text-gray-400 text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Memuat halaman...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
