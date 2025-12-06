import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Paper, Button } from '@mui/material';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/verify-email?token=${token}`);
        setSuccess(response.data.message);
      } catch (err) {
        setError(err.response?.data?.error || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Paper elevation={3} className="p-8 w-full max-w-md rounded-2xl text-center">
        {loading ? (
          <>
            <CircularProgress size={48} />
            <Typography className="mt-4">Verifying your email...</Typography>
          </>
        ) : success ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 64 }} className="text-green-500" />
            <Typography variant="h5" className="font-bold mt-4 text-gray-800 dark:text-white">
              Email Verified!
            </Typography>
            <Typography className="text-gray-500 mt-2">
              {success}
            </Typography>
            <Button
              variant="contained"
              className="mt-6"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ fontSize: 64 }} className="text-red-500" />
            <Typography variant="h5" className="font-bold mt-4 text-gray-800 dark:text-white">
              Verification Failed
            </Typography>
            <Typography className="text-gray-500 mt-2">
              {error}
            </Typography>
            <Link to="/login">
              <Button variant="contained" className="mt-6">
                Go to Login
              </Button>
            </Link>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
