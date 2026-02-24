import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Default mode
    primary: {
      main: '#2563EB', // Blue - matching gradient start
    },
    secondary: {
      main: '#ffffff', // White
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        contained: {
          background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          },
          '&.Mui-disabled': {
            background: '#e0e0e0',
            color: '#9e9e9e',
            boxShadow: 'none',
          },
        },
        containedSecondary: {
          color: '#2563EB',
          '&.Mui-disabled': {
            background: '#e0e0e0',
            color: '#9e9e9e',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
