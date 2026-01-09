import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, TextField, Paper, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SignerSetupPanel from './SignerSetupPanel';

const DocumentUploadStep = ({ 
  draftFile,
  onDraftFileChange,
  onTitleChange, 
  mode, 
  selectedSigners, 
  onSignersChange, 
  currentUser 
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Create preview URL when draftFile changes
  useEffect(() => {
    if (draftFile) {
      const url = URL.createObjectURL(draftFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [draftFile]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setError(null);
    
    // Store file locally instead of uploading
    onDraftFileChange(file);
    onTitleChange(title || file.name);
  }, [title, onDraftFileChange, onTitleChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: draftFile !== null
  });

  const handleRemoveDocument = () => {
    onDraftFileChange(null);
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
        disabled={draftFile !== null}
      />

      {/* Upload Area */}
      {!draftFile ? (
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
        </Paper>
      ) : (
        /* Document Preview - Draft Mode */
        <Paper 
          elevation={0} 
          className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6"
        >
          <Box className="flex items-center gap-4">
            <Box className="w-16 h-16 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <PictureAsPdfIcon sx={{ fontSize: 32, color: '#ef4444' }} />
            </Box>
            
            <Box className="flex-1">
              <Box className="flex items-center gap-2 mb-1">
                <CheckCircleIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                <Typography variant="subtitle1" className="font-semibold text-gray-800 dark:text-white">
                  Dokumen Siap (Draft)
                </Typography>
              </Box>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                {title || draftFile.name}
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Ukuran: {(draftFile.size / 1024 / 1024).toFixed(2)} MB
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

