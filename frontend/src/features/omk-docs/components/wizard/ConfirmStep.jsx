import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Divider, CircularProgress, Alert, Chip, Avatar } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DrawIcon from '@mui/icons-material/Draw';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import GestureIcon from '@mui/icons-material/Gesture';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const ANNOTATION_TYPES = {
  SIGNATURE: 'signature',
  DATE: 'date',
  TEXT: 'text',
  INITIAL: 'initial'
};

const ConfirmStep = ({ wizardData, onSubmit, currentUser }) => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { mode, document, annotations } = wizardData;
  const isSelfMode = mode === 'self';

  // Group annotations by signer
  const signerAnnotations = annotations.reduce((acc, ann) => {
    if (ann.signerId) {
      if (!acc[ann.signerId]) {
        acc[ann.signerId] = {
          signer: { id: ann.signerId, name: ann.signerName },
          annotations: []
        };
      }
      acc[ann.signerId].annotations.push(ann);
    }
    return acc;
  }, {});

  const getAnnotationIcon = (type) => {
    switch (type) {
      case ANNOTATION_TYPES.SIGNATURE: return <DrawIcon sx={{ color: '#3b82f6', fontSize: 16 }} />;
      case ANNOTATION_TYPES.DATE: return <CalendarTodayIcon sx={{ color: '#8b5cf6', fontSize: 16 }} />;
      case ANNOTATION_TYPES.TEXT: return <TextFieldsIcon sx={{ color: '#22c55e', fontSize: 16 }} />;
      case ANNOTATION_TYPES.INITIAL: return <GestureIcon sx={{ color: '#f97316', fontSize: 16 }} />;
      default: return null;
    }
  };

  const getAnnotationLabel = (type) => {
    switch (type) {
      case ANNOTATION_TYPES.SIGNATURE: return 'Tanda Tangan';
      case ANNOTATION_TYPES.DATE: return 'Tanggal';
      case ANNOTATION_TYPES.TEXT: return 'Teks';
      case ANNOTATION_TYPES.INITIAL: return 'Paraf';
      default: return 'Unknown';
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (isSelfMode) {
        // Self-sign mode: Create request then immediately sign
        for (const annotation of annotations) {
          if (annotation.type) {
            // Create signature request
            const requestRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/documents/request-sign`,
              {
                documentId: document.id,
                signerId: currentUser.id,
                x: annotation.position.x / (annotation.refWidth || 600),
                y: annotation.position.y / (annotation.refHeight || 800),
                width: annotation.width / (annotation.refWidth || 600),
                height: annotation.height / (annotation.refHeight || 800),
                type: annotation.type,
                text: annotation.text,
                page: annotation.page
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Immediately sign it
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/documents/sign`,
              { requestId: requestRes.data.request.id },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        }
      } else {
        // Request mode: Create signature requests for each signer's annotations
        for (const annotation of annotations) {
          if (annotation.type && annotation.signerId) {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/documents/request-sign`,
              {
                documentId: document.id,
                signerId: annotation.signerId,
                x: annotation.position.x / (annotation.refWidth || 600),
                y: annotation.position.y / (annotation.refHeight || 800),
                width: annotation.width / (annotation.refWidth || 600),
                height: annotation.height / (annotation.refHeight || 800),
                type: annotation.type,
                text: annotation.text,
                page: annotation.page
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        }
      }

      setSuccess(true);
      if (onSubmit) {
        setTimeout(() => onSubmit(), 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Gagal memproses permintaan');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Box className="flex flex-col items-center justify-center h-full py-12">
        <Box 
          sx={{ 
            width: 96, 
            height: 96, 
            borderRadius: '50%', 
            backgroundColor: 'rgba(34, 197, 94, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 3
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48, color: '#22c55e' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          {isSelfMode ? 'Dokumen Berhasil Ditandatangani!' : 'Permintaan Berhasil Dikirim!'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {isSelfMode 
            ? 'Dokumen Anda sudah ditandatangani dengan kode QR verifikasi.'
            : 'Penanda tangan telah diberitahu dan akan menerima dokumen untuk ditandatangani.'
          }
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <Box className="text-center mb-8">
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          Tinjau & Konfirmasi
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {isSelfMode 
            ? 'Tinjau dokumen sebelum menandatangani'
            : 'Tinjau permintaan tanda tangan sebelum mengirim'
          }
        </Typography>
      </Box>

      {/* Mode Badge */}
      <Box className="flex justify-center">
        <Chip 
          icon={isSelfMode ? <DrawIcon /> : <SendIcon />}
          label={isSelfMode ? 'Tanda Tangan Sendiri' : 'Minta Tanda Tangan'}
          color={isSelfMode ? 'success' : 'primary'}
        />
      </Box>

      {/* Document Info */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 2 }}>
          DOKUMEN
        </Typography>
        <Box className="flex items-center gap-4">
          <Box 
            sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: 3, 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <PictureAsPdfIcon sx={{ fontSize: 28, color: '#ef4444' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {document?.title || 'Untitled Document'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ID: {document?.id}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Annotations Summary */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 2 }}>
          ANOTASI ({annotations.length})
        </Typography>
        <Box className="flex flex-wrap gap-2">
          {Object.values(ANNOTATION_TYPES).map(type => {
            const count = annotations.filter(a => a.type === type).length;
            if (count === 0) return null;
            return (
              <Chip
                key={type}
                icon={getAnnotationIcon(type)}
                label={`${count} ${getAnnotationLabel(type)}`}
                variant="outlined"
                size="small"
              />
            );
          })}
        </Box>
      </Paper>

      {/* Signers Summary */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 2 }}>
          {isSelfMode ? 'PENANDA TANGAN' : `PENANDA TANGAN (${Object.keys(signerAnnotations).length})`}
        </Typography>
        <Box className="space-y-2">
          {isSelfMode ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, backgroundColor: 'grey.50' }}>
              <Avatar sx={{ bgcolor: '#22c55e', width: 32, height: 32, fontSize: 14 }}>
                {currentUser?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {currentUser?.name || 'You'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {currentUser?.email}
                </Typography>
              </Box>
              <Chip label="Anda" size="small" sx={{ ml: 'auto' }} />
            </Box>
          ) : (
            Object.values(signerAnnotations).map(({ signer, annotations: signerAnns }) => (
              <Box 
                key={signer.id} 
                sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, backgroundColor: 'grey.50' }}
              >
                <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32, fontSize: 14 }}>
                  {signer.name?.charAt(0) || 'U'}
                </Avatar>
                <Box className="flex-1">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {signer.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {signerAnns.length} field tanda tangan
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {error && (
        <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Submit Button */}
      <Box className="flex justify-center">
        <Button
          variant="contained"
          size="large"
          startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : (isSelfMode ? <DrawIcon /> : <SendIcon />)}
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ 
            px: 4, 
            py: 1.5, 
            borderRadius: 3,
            background: isSelfMode 
              ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            fontSize: '1rem',
            '&:hover': {
              background: isSelfMode
                ? 'linear-gradient(135deg, #16a34a 0%, #059669 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            }
          }}
        >
          {submitting 
            ? 'Memproses...' 
            : (isSelfMode ? 'Tanda Tangani Sekarang' : 'Kirim Permintaan')
          }
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmStep;
