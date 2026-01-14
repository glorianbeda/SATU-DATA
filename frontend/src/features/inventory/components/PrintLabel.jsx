import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Print as PrintIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';

const PrintLabel = ({ open, onClose, assetId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const printRef = useRef(null);

  useEffect(() => {
    if (open && assetId) {
      fetchAsset();
    }
  }, [open, assetId]);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      const response = await api.get(INVENTORY_API.GET_ASSET(assetId));
      setAsset(response.data.asset);
      
      // Generate QR code
      const qrResponse = await api.post(INVENTORY_API.GENERATE_BARCODE, {
        assetCode: response.data.asset.assetCode,
      });
      setQrCode(qrResponse.data.qrCode);
    } catch (err) {
      console.error('Error fetching asset:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Asset Label</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              .label {
                border: 2px solid #000;
                padding: 20px;
                width: 300px;
                text-align: center;
                page-break-after: always;
              }
              .label h1 {
                margin: 0 0 10px 0;
                font-size: 18px;
              }
              .label p {
                margin: 5px 0;
                font-size: 14px;
              }
              .label .qr-code {
                margin: 15px 0;
              }
              .label .qr-code img {
                width: 150px;
                height: 150px;
              }
              .label .barcode {
                font-size: 20px;
                font-weight: bold;
                letter-spacing: 2px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleClose = () => {
    setAsset(null);
    setQrCode('');
    setError('');
    setQuantity(1);
    onClose();
  };

  const generateLabels = () => {
    const labels = [];
    for (let i = 0; i < quantity; i++) {
      labels.push(
        <div className="label" key={i}>
          <h1>{asset?.name}</h1>
          <p><strong>{t('inventory.asset_code')}:</strong> {asset?.assetCode}</p>
          <p><strong>{t('inventory.category')}:</strong> {asset?.category?.name}</p>
          <div className="qr-code">
            {qrCode && <img src={qrCode} alt="QR Code" />}
          </div>
          <div className="barcode">
            {asset?.assetCode}
          </div>
        </div>
      );
    }
    return labels;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PrintIcon />
            <Typography variant="h6">{t('inventory.print_label')}</Typography>
          </Box>
          <Button onClick={handleClose} size="small">
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                {t('inventory.print_quantity')}
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 100 }}
                fullWidth
              />
            </Box>
            <Box
              ref={printRef}
              sx={{
                display: 'none',
              }}
            >
              {generateLabels()}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handlePrint}
          disabled={loading || !qrCode}
          startIcon={<PrintIcon />}
        >
          {t('inventory.print_label')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintLabel;
