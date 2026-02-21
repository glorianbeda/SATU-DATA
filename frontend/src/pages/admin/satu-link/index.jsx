import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const AdminSatuLinkIndex = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/satu-link/short-links');
  }, [navigate]);

  return (
    <Box className="flex justify-center items-center h-64">
      <CircularProgress />
    </Box>
  );
};

export default AdminSatuLinkIndex;
