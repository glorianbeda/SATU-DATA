import { Suspense } from 'react'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import routes from '~react-pages'
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider } from './context/AlertContext';
import { ConfirmationProvider } from './context/ConfirmationContext';
import MuiThemeProviderWrapper from './context/MuiThemeProvider';

function AppRoutes() {
  return useRoutes(routes)
}

import GlobalLoader from './components/GlobalLoader';
import PageLoader from './components/PageLoader';
import MainLayout from './components/MainLayout';

// ...

import { CartProvider } from './context/CartContext';

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
                  <MainLayout>
                    <AppRoutes />
                  </MainLayout>
                </Suspense>
              </Router>
            </CartProvider>
          </ConfirmationProvider>
        </AlertProvider>
      </MuiThemeProviderWrapper>
    </ThemeProvider>
  )
}

export default App

