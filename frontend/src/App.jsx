import { Suspense, useMemo } from 'react'
import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import routes from '~react-pages';
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider } from './context/AlertContext';
import { ConfirmationProvider } from './context/ConfirmationContext';
import MuiThemeProviderWrapper from './context/MuiThemeProvider';
import GlobalLoader from './components/GlobalLoader';
import PageLoader from './components/PageLoader';
import MainLayout from './components/MainLayout';
import { CartProvider } from './context/CartContext';

const PUBLIC_ROUTES = [
  '/satu-link/s/:code',
  '/satu-link/u/:username',
];

function AppRoutes() {
  const location = useLocation();
  
  const isPublicRoute = useMemo(() => {
    const path = location.pathname;
    return PUBLIC_ROUTES.some(route => {
      const regex = new RegExp('^' + route.replace(/:[^/]+/g, '[^/]+') + '$');
      return regex.test(path);
    });
  }, [location.pathname]);

  const routesElement = useRoutes(routes);

  if (isPublicRoute) {
    return routesElement;
  }

  return (
    <MainLayout>
      {routesElement}
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MuiThemeProviderWrapper>
        <AlertProvider>
          <ConfirmationProvider>
            <CartProvider>
              <CssBaseline />
              <Router>
                <GlobalLoader />
                <Suspense fallback={<PageLoader />}>
                  <AppRoutes />
                </Suspense>
              </Router>
            </CartProvider>
          </ConfirmationProvider>
        </AlertProvider>
      </MuiThemeProviderWrapper>
    </ThemeProvider>
  )
}

export default App;
