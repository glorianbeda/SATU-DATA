import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import NProgress from 'nprogress';

/**
 * PageLoader - Inline loading spinner for Suspense fallback
 * 
 * Centers within the content area, NOT fullscreen.
 * Sidebar and header remain visible during page loads.
 */
const PageLoader = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Spinner */}
        <div className="relative">
          <motion.div
            className="w-10 h-10 border-3 border-blue-200 dark:border-blue-900 rounded-full"
            style={{ borderTopColor: '#3b82f6', borderWidth: '3px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Loading text */}
        <motion.p 
          className="text-gray-400 dark:text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Memuat...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PageLoader;
