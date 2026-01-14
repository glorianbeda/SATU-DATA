import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  QrCodeScanner as QrCodeScannerIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';

const BarcodeScanner = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [assetCode, setAssetCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [asset, setAsset] = useState(null);
  const [scanned, setScanned] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleScan = async () => {
    if (!assetCode.trim()) {
      setError(t('inventory.asset_code') + ' ' + t('common.required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try to find asset by code
      const response = await api.get(`${INVENTORY_API.GET_ASSETS}?code=${assetCode.trim()}`);
      const assets = response.data.assets || [];
      
      if (assets.length > 0) {
        setAsset(assets[0]);
        setScanned(true);
      } else {
        setError(t('inventory.asset_not_found'));
      }
    } catch (err) {
      console.error('Error scanning barcode:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  const handleClose = () => {
    setAssetCode('');
    setAsset(null);
    setError('');
    setScanned(false);
    onClose();
  };

  const handleViewAsset = () => {
    if (asset) {
      window.location.href = `/inventory/assets/${asset.id}`;
    }
  };

  const handleReset = () => {
    setAssetCode('');
    setAsset(null);
    setError('');
    setScanned(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCodeScannerIcon />
            <Typography variant="h6">{t('inventory.scan_barcode')}</Typography>
          </Box>
          <Button onClick={handleClose} size="small">
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {!scanned ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('inventory.scan_barcode_hint')}
            </Typography>
            <TextField
              fullWidth
              label={t('inventory.asset_code')}
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              onKeyPress={handleKeyPress}
              inputRef={inputRef}
              autoFocus
              error={!!error}
              helperText={error}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={handleScan}
                    disabled={loading || !assetCode.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  >
                    {t('common.search')}
                  </Button>
                ),
              }}
            />
          </Box>
        ) : (
          <Box>
            {asset && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {asset.name}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('inventory.asset_code')}:</strong> {asset.assetCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('inventory.category')}:</strong> {asset.category?.name || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('inventory.status')}:</strong>{' '}
                      <span style={{
                        color: asset.status === 'AVAILABLE' ? '#2e7d32' :
                              asset.status === 'BORROWED' ? '#ed6c02' :
                              asset.status === 'MAINTENANCE' ? '#d32f2f' : '#d32f2f'
                      }}>
                        {asset.status}
                      </span>
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleViewAsset}
                      fullWidth
                    >
                      {t('common.view')}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      fullWidth
                    >
                      {t('common.cancel')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {!scanned && (
          <Button onClick={handleClose} disabled={loading}>
            {t('common.close')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeScanner;
