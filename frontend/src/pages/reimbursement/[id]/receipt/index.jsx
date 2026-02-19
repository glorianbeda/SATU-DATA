import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ArrowBack, Print } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { REIMBURSEMENT_API } from '~/features/reimbursement/constants/api';
import { useLayout } from '~/context/LayoutContext';

// Note: The logo path should be adjusted based on the actual logo location
// This is a placeholder - in production, you'd import the actual image
const LOGO_PLACEHOLDER = '/vite.svg';

const ReimbursementReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle('Nota Pencaiaran');
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const response = await api.get(REIMBURSEMENT_API.GET_RECEIPT(id));
      setReceipt(response.data);
    } catch (err) {
      console.error('Error fetching receipt:', err);
      setError(err.response?.data?.error || 'Gagal memuat nota');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/reimbursement')}>
          Kembali
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, printHidden: true }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/reimbursement')}>
          Kembali
        </Button>
        <Button variant="contained" startIcon={<Print />} onClick={handlePrint}>
          Cetak
        </Button>
      </Box>

      {/* Receipt Paper */}
      <Paper sx={{ p: 4, bgcolor: 'white' }} id="receipt">
        {/* Header with Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box 
            component="img" 
            src={LOGO_PLACEHOLDER} 
            alt="Logo OMK" 
            sx={{ height: 60, mb: 2 }} 
          />
          <Typography variant="h5" fontWeight="bold">
            {t('reimbursement.receipt', 'NOTA PENCAIRAN REIMBURSEMENT')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No: {receipt?.receiptNumber}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Date */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Tanggal Pencairan
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {receipt?.date}
          </Typography>
        </Box>

        {/* Beneficiary Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Penerima
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {receipt?.beneficiary?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {receipt?.beneficiary?.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Amount */}
        <Box sx={{ mb: 3, textAlign: 'center', py: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Jumlah Pencairan
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {receipt?.amount?.formatted}
          </Typography>
        </Box>

        {/* Disbursement Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Metode Pencairan
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Metode</Typography>
              <Typography variant="body1">
                {receipt?.disbursement?.method === 'CASH' ? 'Tunai' :
                 receipt?.disbursement?.method === 'BANK' ? 'Transfer Bank' : 'Cashless/e-Money'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Nomor Rekening/HP</Typography>
              <Typography variant="body1">{receipt?.disbursement?.accountNumber}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Notes */}
        {receipt?.notes && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">Catatan</Typography>
            <Typography variant="body1">{receipt.notes}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Penerima</Typography>
            <Box sx={{ mt: 4, borderTop: '1px solid #333', pt: 1, minWidth: 120 }}>
              <Typography variant="body2">{receipt?.beneficiary?.name}</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Disetujui Oleh</Typography>
            <Box sx={{ mt: 4, borderTop: '1px solid #333', pt: 1, minWidth: 120 }}>
              <Typography variant="body2">{receipt?.approvedBy}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer Text */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
          Dokumen ini adalah bukti sah pencairan reimbursement dari sistem Satu Data OMK
        </Typography>
      </Paper>

      {/* Grid component for layout */}
      <Box sx={{ display: 'none' }} component="div">
        {/* This is a workaround for Grid import - using CSS instead */}
      </Box>
    </Box>
  );
};

// Simple Grid replacement component
const Grid = ({ children, container, spacing, item, xs, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing ? 2 : 0,
      ...(container && { width: '100%' }),
      ...(item && { flex: xs ? `0 0 ${(xs / 12) * 100}%` : 'auto', maxWidth: xs ? `${(xs / 12) * 100}%` : 'auto' }),
    }}
    {...props}
  >
    {children}
  </Box>
);

export default ReimbursementReceipt;
