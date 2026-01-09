import React, { useState } from 'react';
import api from '~/utils/api';
import { Button, Box, Typography, CircularProgress, Alert, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DocumentUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await api.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data.document);
      }
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Box className="p-4 border border-dashed border-gray-300 rounded-lg flex flex-col items-center gap-4">
      <input
        accept="application/pdf"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
          Select PDF
        </Button>
      </label>
      
      {file && (
        <Typography variant="body2" className="text-gray-700">
          Selected: {file.name}
        </Typography>
      )}

      {error && (
        <Alert severity="error" className="w-full">{error}</Alert>
      )}

      {loading && (
        <Box className="w-full">
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="textSecondary" align="center" display="block">{progress}%</Typography>
        </Box>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleUpload} 
        disabled={!file || loading}
      >
        {loading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </Box>
  );
};

export default DocumentUpload;
