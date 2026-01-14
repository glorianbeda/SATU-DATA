import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Paper, Button, CircularProgress, 
  Container, Avatar, Grid, Chip, Divider, Alert
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const API_URL = import.meta.env.VITE_API_URL;

const getFileIcon = (mimeType) => {
  if (mimeType?.includes('pdf')) return <PictureAsPdfIcon sx={{ fontSize: 60, color: '#d32f2f' }} />;
  if (mimeType?.includes('image')) return <ImageIcon sx={{ fontSize: 60, color: '#1976d2' }} />;
  if (mimeType?.includes('word') || mimeType?.includes('document')) return <DescriptionIcon sx={{ fontSize: 60, color: '#0288d1' }} />;
  return <InsertDriveFileIcon sx={{ fontSize: 60, color: '#757575' }} />;
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function SharedArchivePage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/archives/share/${token}`);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Gagal memuat file yang dibagikan');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleDownload = () => {
    window.location.href = `${API_URL}/api/archives/share/${token}?download=true`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Terjadi Kesalahan
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" href="/login">
            Kembali ke Beranda
          </Button>
        </Paper>
      </Container>
    );
  }

  const { archive, expiresAt } = data;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
            Satu Data+
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            File Sharing
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 0, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff' }}>
            <Box sx={{ mb: 3 }}>
              {getFileIcon(archive.mimeType)}
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, wordBreak: 'break-word' }}>
              {archive.originalName}
            </Typography>
            <Chip 
              label={formatSize(archive.fileSize)} 
              size="small" 
              sx={{ bgcolor: '#f1f5f9', fontWeight: 500 }} 
            />
          </Box>
          
          <Divider />

          <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Dibagikan oleh
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {archive.uploadedBy?.name || 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.light' }}>
                    <CalendarTodayIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Diupload pada
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {new Date(archive.createdAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 3 }}>
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
            >
              Unduh File
            </Button>
            {expiresAt && (
              <Typography variant="caption" display="block" textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
                Link ini berlaku sampai {new Date(expiresAt).toLocaleDateString('id-ID')}
              </Typography>
            )}
          </Box>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Satu Data+. Secure File Sharing.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
