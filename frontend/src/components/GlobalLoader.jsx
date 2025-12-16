import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

// Configure NProgress for a slim, fast loading bar
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  speed: 300,
  trickleSpeed: 100,
});

/**
 * GlobalLoader - Non-intrusive loading indicator for SPA navigation
 * 
 * Only shows NProgress bar at top of viewport.
 * NO fullscreen overlay - sidebar/header remain visible during navigation.
 */
const GlobalLoader = () => {
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(location.pathname);

  useEffect(() => {
    // Navigation completed - stop loading bar
    if (previousPath !== location.pathname) {
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
        NProgress.start();
      }
    };

    // Capture phase to get the click before React Link handles it
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [location.pathname]);

  // Listen for programmatic navigation (useNavigate calls)
  useEffect(() => {
    const originalPushState = window.history.pushState;

    window.history.pushState = function(...args) {
      NProgress.start();
      return originalPushState.apply(this, args);
    };

    return () => {
      window.history.pushState = originalPushState;
    };
  }, []);

  // No visual component - only NProgress bar (rendered via CSS)
  return null;
};

export default GlobalLoader;
