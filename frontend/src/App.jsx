import { Suspense } from 'react'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import routes from '~react-pages'
import { ThemeProvider } from './context/ThemeContext';

function AppRoutes() {
  return useRoutes(routes)
}

import PageLoader from './components/PageLoader';

// ...

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </Router>
    </ThemeProvider>
  )
}

export default App
