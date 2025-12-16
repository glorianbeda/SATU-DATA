# Tasks: Improve SPA Navigation UX

## 1. Refactor GlobalLoader

- [x] 1.1 Remove full-screen overlay from `GlobalLoader.jsx`
- [x] 1.2 Keep NProgress bar functionality (slim loading bar at top)
- [x] 1.3 Remove `backdrop-blur` and `bg-gray-50/80` overlay
- [x] 1.4 Remove fullscreen spinner component

## 2. Refactor PageLoader (Suspense Fallback)

- [x] 2.1 Convert `PageLoader.jsx` from fullscreen to inline loader
- [x] 2.2 Center spinner only in main content area, not viewport
- [x] 2.3 Make loader respect parent container dimensions
- [x] 2.4 Keep NProgress integration for async page loads

## 3. Add Content Transition (Optional)

- [x] 3.1 Add subtle fade transition when page content changes
- [x] 3.2 Use `framer-motion` AnimatePresence for smooth entry/exit
- [x] 3.3 Ensure transitions don't delay perceived performance

## 4. Verification

- [x] 4.1 Run `yarn dev` and navigate between pages
- [x] 4.2 Verify sidebar/header remain visible during navigation
- [x] 4.3 Verify NProgress bar appears at top during navigation
- [x] 4.4 Verify content area shows inline loader (not fullscreen)
- [x] 4.5 Test on slow network (DevTools throttling) to verify loading states
- [x] 4.6 Run `yarn build` to ensure no build errors
