import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';

import GradientDialog from '~/components/GradientDialog';

const PrintLabel = ({ open, onClose, assetId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && assetId) {
      fetchAsset();
    }
  }, [open, assetId, fetchAsset]);

  const fetchAsset = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(INVENTORY_API.GET_ASSET(assetId));
      setAsset(response.data.asset);
    } catch (err) {
      console.error('Error fetching asset:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [assetId, t]);

  const handlePrint = async () => {
    try {
      setLoading(true);
      
      // Use native fetch for binary data to avoid Axios JSON parsing issues
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/inventory/labels/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            assets: [asset],
            config: { type: 'single' }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `label-${asset.assetCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onClose();
    } catch (err) {
      console.error('Error generating label:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAsset(null);
    setError('');
    onClose();
  };

  return (
    <GradientDialog
      open={open}
      onClose={handleClose}
      title={t('inventory.print_label')}
      icon={<PrintIcon />}
      maxWidth="sm"
      loading={loading}
      actions={
        <>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handlePrint}
            disabled={loading || !asset}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            sx={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)',
              },
              '&.Mui-disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? t('common.processing') : `${t('common.download')} PDF`}
          </Button>
        </>
      }
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={48} thickness={4} sx={{ color: '#3b82f6' }} />
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            {t('common.processing')}
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box>
          <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
             <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  {asset?.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', py: 1, px: 2, borderRadius: 1, display: 'inline-block' }}>
                  {asset?.assetCode}
                </Typography>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                     <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                       {t('common.label_size')}
                     </Typography>
                     <Typography variant="body2" fontWeight="medium">
                       7cm x 3.5cm
                     </Typography>
                  </Box>
                </Box>
             </CardContent>
          </Card>

          <Typography variant="body2" color="text.secondary" align="center">
             High-quality PDF label will be generated directly from the server.
          </Typography>
        </Box>
      )}
    </GradientDialog>
  );
};

export default PrintLabel;
