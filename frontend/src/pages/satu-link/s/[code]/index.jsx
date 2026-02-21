import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

const RedirectPage = () => {
  const { code = '' } = useParams();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!code) {
      window.location.href = '/';
      return;
    }

    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');
    const redirectUrl = `${baseUrl}/satu-link/s/${code}`;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      window.location.href = redirectUrl;
    }, 7000);

    return () => clearInterval(interval);
  }, [code]);

  return (
    <Box
      className="min-h-screen flex flex-col items-center justify-center p-4"
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <Box className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <Box className="mb-4">
          <img src="/xs-logo-satu-data.svg" alt="Satu Data" className="w-16 h-16 mx-auto" />
        </Box>

        <Typography variant="h5" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
          Satu Data+
        </Typography>

        <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
          Mengalihkan Anda ke tautan tujuan...
        </Typography>

        <Box className="w-full mb-4">
          <Box className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <Box
              className="h-full bg-blue-600 rounded-full transition-all duration-150 ease-linear"
              sx={{ width: `${progress}%` }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: '#999', mt: 1, display: 'block' }}>
            {progress < 100 ? 'Mohon tunggu...' : 'Mengalihkan...'}
          </Typography>
        </Box>

        <CircularProgress size={32} sx={{ color: '#1976d2' }} />

        <Typography variant="body2" sx={{ color: '#999', mt: 3 }}>
          Jika tidak ada pengalihan, klik tombol di bawah:
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');
            window.location.href = `${baseUrl}/satu-link/s/${code}`;
          }}
          sx={{ mt: 2 }}
        >
          Klik di sini jika tidak dialihkan
        </Button>
      </Box>

      <Typography variant="caption" sx={{ color: '#999', mt: 4 }}>
        © {new Date().getFullYear()} OMK HMTB Cicurug. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default RedirectPage;
