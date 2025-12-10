import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import NProgress from 'nprogress';
import { motion, AnimatePresence } from 'motion/react';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  speed: 300,
  trickleSpeed: 100,
});

const GlobalLoader = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState(location.pathname);

  useEffect(() => {
    // Detect actual navigation (not initial load)
    if (previousPath !== location.pathname) {
      // Navigation completed - stop loading
      setIsLoading(false);
      NProgress.done();
      setPreviousPath(location.pathname);
    }
  }, [location.pathname, previousPath]);

  // Listen for clicks on navigation links to start loading IMMEDIATELY
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a[href]');
      if (!target) return;

      const href = target.getAttribute('href');
      // Only for internal links that will cause navigation
      if (href && href.startsWith('/') && href !== location.pathname) {
        setIsLoading(true);
        NProgress.start();
      }
    };

    // Capture phase to get the click before React Link handles it
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [location.pathname]);

  // Also listen for programmatic navigation (useNavigate calls)
  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      setIsLoading(true);
      NProgress.start();
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      // Don't show loading for replace (usually not a real navigation)
      return originalReplaceState.apply(this, args);
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  // Fallback: ensure loading is hidden after a maximum time
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        NProgress.done();
      }, 5000); // Max 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 rounded-full"
                style={{ borderTopColor: '#3b82f6' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p
              className="text-gray-600 dark:text-gray-400 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Memuat...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
