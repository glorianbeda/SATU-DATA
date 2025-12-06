import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import NProgress from 'nprogress';

/**
 * PageLoader - Shows animated loading spinner during page transition
 * Uses framer-motion for smooth entrance animation
 */
const PageLoader = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
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
          {/* Spinner */}
          <div className="relative">
            <motion.div
              className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 rounded-full"
              style={{ borderTopColor: '#3b82f6' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Loading text */}
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
    </AnimatePresence>
  );
};

export default PageLoader;
