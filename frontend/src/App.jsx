import { Suspense } from 'react'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import routes from '~react-pages'
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider } from './context/AlertContext';
import MuiThemeProviderWrapper from './context/MuiThemeProvider';

function AppRoutes() {
  return useRoutes(routes)
}

import GlobalLoader from './components/GlobalLoader';
import PageLoader from './components/PageLoader';

// ...

function App() {
  return (
    <ThemeProvider>
      <MuiThemeProviderWrapper>
        <AlertProvider>
          <CssBaseline />
          <Router>
            <GlobalLoader />
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </Router>
        </AlertProvider>
      </MuiThemeProviderWrapper>
    </ThemeProvider>
  )
}

export default App

