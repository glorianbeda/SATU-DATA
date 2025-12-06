import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper, Alert, CircularProgress, Tabs, Tab, TextField, Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DrawIcon from '@mui/icons-material/Draw';

const ValidateDocument = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [checksum, setChecksum] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // File upload validation
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/documents/validate-upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading
  });

  // Checksum validation
  const handleValidateChecksum = async () => {
    if (!checksum) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/validate/${checksum}`);
      setResult(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setResult({ valid: false });
      } else {
        setError('Validation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setResult(null);
    setError(null);
  };

  return (
    <Box className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <Box className="text-center mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 dark:text-white mb-2">
          {t('docs.validate_document') || 'Validate Document'}
        </Typography>
        <Typography variant="body1" className="text-gray-500 dark:text-gray-400">
          {t('docs.validate_description') || 'Verify the authenticity of a signed document'}
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper elevation={0} className="mb-6 rounded-xl overflow-hidden">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          className="bg-gray-50 dark:bg-gray-800"
        >
          <Tab 
            label={t('docs.upload_file') || 'Upload File'} 
            icon={<CloudUploadIcon />}
            iconPosition="start"
          />
          <Tab 
            label={t('docs.enter_checksum') || 'Enter Checksum'} 
            icon={<DrawIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Paper elevation={0} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
        {tabValue === 0 ? (
          /* File Upload Tab */
          <Box
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
              transition-all duration-300 ease-in-out
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }
              ${loading ? 'pointer-events-none opacity-70' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <Box className="flex flex-col items-center gap-4">
              {loading ? (
                <CircularProgress size={48} />
              ) : (
                <>
                  <Box 
                    className={`
                      w-20 h-20 rounded-full flex items-center justify-center
                      ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}
                    `}
                  >
                    <PictureAsPdfIcon className="text-4xl" />
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" className="font-semibold text-gray-700 dark:text-gray-200">
                      {isDragActive 
                        ? (t('docs.drop_here') || 'Drop the file here')
                        : (t('docs.drag_to_validate') || 'Drag & drop PDF to validate')
                      }
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 dark:text-gray-400 mt-1">
                      {t('docs.or_click') || 'or click to browse files'}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        ) : (
          /* Checksum Tab */
          <Box className="space-y-4">
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
              {t('docs.checksum_instructions') || 'Enter the SHA-256 checksum of the document to verify its authenticity.'}
            </Typography>
            <Box className="flex gap-4">
              <TextField 
                fullWidth 
                label={t('docs.document_checksum') || 'Document Checksum'} 
                variant="outlined" 
                value={checksum}
                onChange={(e) => setChecksum(e.target.value)}
                placeholder="e.g., a1b2c3d4e5f6..."
                disabled={loading}
              />
              <Button 
                variant="contained" 
                onClick={handleValidateChecksum}
                disabled={loading || !checksum}
                className="px-6 whitespace-nowrap"
              >
                {loading ? <CircularProgress size={24} /> : (t('docs.validate') || 'Validate')}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Error */}
      {error && (
        <Alert severity="error" className="mb-6 rounded-xl">
          {error}
        </Alert>
      )}

      {/* Result */}
      {result && (
        <Paper 
          elevation={0} 
          className={`p-6 rounded-xl border-l-4 ${
            result.valid 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
              : 'border-red-500 bg-red-50 dark:bg-red-900/20'
          }`}
        >
          <Box className="flex items-center gap-4 mb-6">
            {result.valid ? (
              <Box className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                <CheckCircleIcon className="text-4xl text-green-500" />
              </Box>
            ) : (
              <Box className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-800/50 flex items-center justify-center">
                <CancelIcon className="text-4xl text-red-500" />
              </Box>
            )}
            <Box>
              <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                {result.valid 
                  ? (t('docs.document_authentic') || 'Document is Authentic')
                  : (t('docs.document_not_found') || 'Document Not Found or Modified')
                }
              </Typography>
              {!result.valid && (
                <Typography variant="body2" className="text-gray-500">
                  {t('docs.invalid_description') || 'This document may have been modified or is not in our system.'}
                </Typography>
              )}
            </Box>
          </Box>

          {result.valid && result.document && (
            <Box className="space-y-4">
              {/* Document Details */}
              <Paper elevation={0} className="p-4 rounded-xl bg-white dark:bg-gray-800">
                <Typography variant="subtitle2" className="font-semibold text-gray-500 mb-3">
                  DOCUMENT DETAILS
                </Typography>
                <Box className="space-y-2">
                  <Box className="flex items-center gap-2">
                    <PictureAsPdfIcon className="text-red-500" />
                    <Typography className="font-semibold">{result.document.title}</Typography>
                  </Box>
                  <Box className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <PersonIcon className="text-sm" />
                    <Typography variant="body2">
                      Uploaded by: {result.document.uploadedBy?.name || 'Unknown'}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CalendarTodayIcon className="text-sm" />
                    <Typography variant="body2">
                      Date: {new Date(result.document.uploadedAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Signatures */}
              <Paper elevation={0} className="p-4 rounded-xl bg-white dark:bg-gray-800">
                <Typography variant="subtitle2" className="font-semibold text-gray-500 mb-3">
                  SIGNATURES
                </Typography>
                {result.document.signatures && result.document.signatures.length > 0 ? (
                  <Box className="space-y-2">
                    {result.document.signatures.map((sig, index) => (
                      <Box 
                        key={index} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                      >
                        <CheckCircleIcon className="text-green-500" />
                        <Box>
                          <Typography variant="body2" className="font-medium">
                            {sig.signer?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            Signed on {sig.signedAt ? new Date(sig.signedAt).toLocaleString() : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography className="text-gray-500 italic">
                    {t('docs.no_signatures') || 'No signatures yet.'}
                  </Typography>
                )}
              </Paper>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ValidateDocument;
