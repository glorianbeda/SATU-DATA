import React, { useState, useCallback } from 'react';
import { Box, Typography, TextField, Paper, LinearProgress, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import SignerSetupPanel from './SignerSetupPanel';

const DocumentUploadStep = ({ 
  document, 
  onDocumentChange, 
  onTitleChange, 
  mode, 
  selectedSigners, 
  onSignersChange, 
  currentUser 
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [title, setTitle] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setUploading(true);
    setError(null);
    setInfo(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', title || file.name);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/documents/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );
      
      if (response.data.exists) {
        setInfo('Dokumen sudah ada. Menggunakan dokumen yang sudah tersimpan.');
      }

      onDocumentChange(response.data.document);
      onTitleChange(title || file.name);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [title, onDocumentChange, onTitleChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading || document !== null
  });

  const handleRemoveDocument = () => {
    onDocumentChange(null);
    setTitle('');
    onTitleChange('');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onTitleChange(e.target.value);
  };

  return (
    <Box className="space-y-6">
      <Box className="text-center mb-8">
        <Typography variant="h5" className="font-bold text-gray-800 dark:text-white mb-2">
          Upload Dokumen
        </Typography>
        <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
          Upload dokumen PDF untuk meminta tanda tangan
        </Typography>
      </Box>

      {/* Title Input */}
      <TextField
        fullWidth
        label="Judul Dokumen"
        placeholder="Masukkan judul dokumen"
        value={title}
        onChange={handleTitleChange}
        variant="outlined"
        className="mb-4"
        disabled={document !== null}
      />

      {/* Upload Area */}
      {!document ? (
        <Paper
          {...getRootProps()}
          elevation={0}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }
            ${uploading ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <Box className="flex flex-col items-center gap-4">
            <Box 
              className={`
                w-20 h-20 rounded-full flex items-center justify-center
                transition-all duration-300
                ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}
              `}
            >
              <CloudUploadIcon sx={{ fontSize: 40 }} />
            </Box>
            
            <Box>
              <Typography variant="h6" className="font-semibold text-gray-700 dark:text-gray-200">
                {isDragActive 
                  ? 'Lepaskan file di sini'
                  : 'Drag & drop PDF di sini'
                }
              </Typography>
              <Typography variant="body2" className="text-gray-500 dark:text-gray-400 mt-1">
                atau klik untuk memilih file
              </Typography>
            </Box>

            <Typography variant="caption" className="text-gray-400">
              Maksimum ukuran file: 50MB
            </Typography>
          </Box>

          {uploading && (
            <Box className="mt-6 w-full max-w-xs mx-auto">
              <LinearProgress variant="determinate" value={uploadProgress} className="rounded-full h-2" />
              <Typography variant="caption" className="text-gray-500 mt-2 block">
                Mengupload... {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
        /* Document Preview */
        <Paper 
          elevation={0} 
          className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-2xl p-6"
        >
          <Box className="flex items-center gap-4">
            <Box className="w-16 h-16 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <PictureAsPdfIcon sx={{ fontSize: 32, color: '#ef4444' }} />
            </Box>
            
            <Box className="flex-1">
              <Box className="flex items-center gap-2 mb-1">
                <CheckCircleIcon sx={{ fontSize: 18, color: '#22c55e' }} />
                <Typography variant="subtitle1" className="font-semibold text-gray-800 dark:text-white">
                  Dokumen Berhasil Diupload
                </Typography>
              </Box>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                {document.title || 'Untitled Document'}
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                ID: {document.id}
              </Typography>
            </Box>
            
            <Box 
              onClick={handleRemoveDocument}
              className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center cursor-pointer hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
            >
              <DeleteIcon sx={{ color: '#ef4444' }} />
            </Box>
          </Box>
        </Paper>
      )}

      {info && (
        <Alert severity="info" className="mt-4 rounded-xl">
          {info}
        </Alert>
      )}

      {error && (
        <Alert severity="error" className="mt-4 rounded-xl">
          {error}
        </Alert>
      )}

      {/* Signer Setup Panel - Only for Request Mode */}
      {mode === 'request' && (
        <SignerSetupPanel 
          selectedSigners={selectedSigners}
          onSignersChange={onSignersChange}
          currentUser={currentUser}
        />
      )}
    </Box>
  );
};

export default DocumentUploadStep;

