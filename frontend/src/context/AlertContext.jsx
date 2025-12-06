import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const AlertContext = createContext(null);

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((message, severity = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setAlerts((prev) => [...prev, { id, message, severity, duration }]);
  }, []);

  const showSuccess = useCallback((message, duration = 4000) => {
    showAlert(message, 'success', duration);
  }, [showAlert]);

  const showError = useCallback((message, duration = 6000) => {
    showAlert(message, 'error', duration);
  }, [showAlert]);

  const showWarning = useCallback((message, duration = 4000) => {
    showAlert(message, 'warning', duration);
  }, [showAlert]);

  const showInfo = useCallback((message, duration = 4000) => {
    showAlert(message, 'info', duration);
  }, [showAlert]);

  const handleClose = useCallback((id, event, reason) => {
    // Don't close on clickaway - only on timeout or explicit close
    if (reason === 'clickaway') {
      return;
    }
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const handleAlertClose = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      {alerts.map((alert, index) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={alert.duration}
          onClose={(event, reason) => handleClose(alert.id, event, reason)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          sx={{ 
            top: `${24 + index * 60}px !important`,
            zIndex: 9999,
          }}
        >
          <Alert
            onClose={() => handleAlertClose(alert.id)}
            severity={alert.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '8px',
            }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export default AlertContext;
