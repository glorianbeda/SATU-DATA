import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const PublicFormLayout = ({ children }) => {
  return (
    <Box className="min-h-screen flex flex-col bg-gray-50">
      {/* Header / Brand Area */}
      <Box className="bg-white border-b border-gray-200 py-4 px-6 fixed top-0 w-full z-10 shadow-sm">
        <Container maxWidth="md" className="flex items-center justify-center">
            <img src="/xm-logo-satu-data.svg" alt="Satu Data" className="h-8" />
        </Container>
      </Box>

      {/* Main Content Area - Scrollable */}
      <Box className="flex-grow pt-20 pb-20 overflow-y-auto">
        <Container maxWidth="md">
           {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box className="bg-white border-t border-gray-200 py-6 mt-auto">
        <Container maxWidth="md" className="text-center">
          <Box className="flex flex-col items-center gap-2">
            <img src="/xs-logo-satu-data.svg" alt="Satu Data" className="h-6 opacity-80" />
            <Typography variant="caption" color="textSecondary">
              &copy; {new Date().getFullYear()} OMK Cicurug. Powered by Satu Data.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicFormLayout;
