import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  CheckCircle,
  Cancel,
  Visibility,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '~/utils/api';
import { REIMBURSEMENT_API } from '~/features/reimbursement/constants/api';
import { useAlert } from '~/context/AlertContext';
import { useLayout } from '~/context/LayoutContext';
import ModalWrapper from '~/components/ModalWrapper';
import ReimbursementWorkflow from '~/features/reimbursement/components/ReimbursementWorkflow';

const ReimbursementDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { setTitle } = useLayout();
  
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    disbursementMethod: 'CASH',
    accountNumber: '',
    evidenceImage: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTitle(t('reimbursement.title', 'Reimbursement Keuangan'));
    fetchReimbursements();
  }, [t]);

  const fetchReimbursements = async () => {
    try {
      setLoading(true);
      const response = await api.get(REIMBURSEMENT_API.GET_MY_REIMBURSEMENTS);
      setReimbursements(response.data.reimbursements || []);
    } catch (error) {
      console.error('Error fetching reimbursements:', error);
      showAlert('Gagal memuat data reimbursement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await api.post(REIMBURSEMENT_API.CREATE_REIMBURSEMENT, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      showAlert('Permintaan reimbursement berhasil diajukan', 'success');
      setOpenModal(false);
      setFormData({
        amount: '',
        disbursementMethod: 'CASH',
        accountNumber: '',
        evidenceImage: null,
      });
      fetchReimbursements();
    } catch (error) {
      console.error('Error creating reimbursement:', error);
      showAlert(error.response?.data?.error || 'Gagal mengajukan reimbursement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING: { color: 'warning', label: t('reimbursement.pending', 'Menunggu') },
      APPROVED: { color: 'info', label: t('reimbursement.approved', 'Disetujui') },
      REJECTED: { color: 'error', label: t('reimbursement.rejected', 'Ditolak') },
      COMPLETED: { color: 'success', label: t('reimbursement.completed', 'Selesai') },
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getMethodLabel = (method) => {
    const labels = {
      CASH: t('reimbursement.cash', 'Tunai'),
      BANK: t('reimbursement.bank', 'Transfer Bank'),
      CASHLESS: t('reimbursement.cashless', 'Cashless/e-Money'),
    };
    return labels[method] || method;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Stats calculation
  const stats = {
    pending: reimbursements.filter(r => r.status === 'PENDING').length,
    approved: reimbursements.filter(r => r.status === 'APPROVED').length,
    completed: reimbursements.filter(r => r.status === 'COMPLETED').length,
    rejected: reimbursements.filter(r => r.status === 'REJECTED').length,
  };

  // Gradient card styles
  const gradientCards = [
    { key: 'pending', label: t('reimbursement.pending', 'Menunggu'), value: stats.pending, gradient: 'from-amber-400 to-orange-500', icon: <Visibility /> },
    { key: 'approved', label: t('reimbursement.approved', 'Disetujui'), value: stats.approved, gradient: 'from-blue-400 to-blue-600', icon: <CheckCircle /> },
    { key: 'completed', label: t('reimbursement.completed', 'Selesai'), value: stats.completed, gradient: 'from-green-400 to-green-600', icon: <ReceiptIcon /> },
    { key: 'rejected', label: t('reimbursement.rejected', 'Ditolak'), value: stats.rejected, gradient: 'from-red-400 to-red-600', icon: <Cancel /> },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600">
          {t('reimbursement.title', 'Reimbursement Keuangan')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
            },
          }}
        >
          {t('reimbursement.request_reimbursement', 'Ajukan Reimbursement')}
        </Button>
      </Box>

      {/* Workflow Guide */}
      <Box sx={{ mb: 3 }}>
        <ReimbursementWorkflow />
      </Box>

      {/* Stats Cards - Gradient Style */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {gradientCards.map((card) => (
          <Grid item xs={6} sm={3} key={card.key}>
            <Card 
              sx={{ 
                bgcolor: 'transparent',
                boxShadow: 'none',
              }}
            >
              <Box
                className={`bg-gradient-to-br ${card.gradient} p-4 rounded-2xl shadow-lg text-white`}
                sx={{
                  background: card.key === 'pending' 
                    ? 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)'
                    : card.key === 'approved'
                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    : card.key === 'completed'
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {card.icon}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.amount', 'Jumlah')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.disbursement_method', 'Metode')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.status', 'Status')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.date', 'Tanggal')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>{}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reimbursements.length > 0 ? (
                reimbursements.map((item) => (
                  <TableRow 
                    key={item.id} 
                    hover
                    sx={{ 
                      '&:hover': { bgcolor: 'grey.50' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="bold" color="primary.main">
                        {formatCurrency(item.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getMethodLabel(item.disbursementMethod)}</TableCell>
                    <TableCell>{getStatusChip(item.status)}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell align="right">
                      {item.status === 'COMPLETED' && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/reimbursement/${item.id}/receipt`)}
                          sx={{ 
                            color: 'success.main',
                            '&:hover': { bgcolor: 'success.light', color: 'white' },
                          }}
                        >
                          <ReceiptIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {t('reimbursement.no_data', 'Belum ada permintaan reimbursement')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Request Modal */}
      <ModalWrapper
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={t('reimbursement.request_reimbursement', 'Ajukan Reimbursement')}
        onSubmit={handleSubmit}
        loadingSubmit={submitting}
        maxWidth="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('reimbursement.amount', 'Jumlah')}
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            fullWidth
            required
            InputProps={{ startAdornment: 'Rp ' }}
          />
          
          <TextField
            select
            label={t('reimbursement.disbursement_method', 'Metode Pencairan')}
            value={formData.disbursementMethod}
            onChange={(e) => setFormData({ ...formData, disbursementMethod: e.target.value })}
            fullWidth
            required
          >
            <MenuItem value="CASH">{t('reimbursement.cash', 'Tunai')}</MenuItem>
            <MenuItem value="BANK">{t('reimbursement.bank', 'Transfer Bank')}</MenuItem>
            <MenuItem value="CASHLESS">{t('reimbursement.cashless', 'Cashless/e-Money')}</MenuItem>
          </TextField>

          {formData.disbursementMethod !== 'CASH' && (
            <TextField
              label={t('reimbursement.account_number', 'Nomor Rekening/HP')}
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              fullWidth
              required
              placeholder={formData.disbursementMethod === 'BANK' ? '1234567890' : '081234567890'}
            />
          )}

          <TextField
            label={t('reimbursement.evidence', 'Bukti/Nota (URL gambar)')}
            value={formData.evidenceImage || ''}
            onChange={(e) => setFormData({ ...formData, evidenceImage: e.target.value })}
            fullWidth
            placeholder="https://example.com/bukti.jpg"
            helperText="Upload gambar ke aplikasi dan masukkan URL"
          />
        </Box>
      </ModalWrapper>
    </Box>
  );
};

export default ReimbursementDashboard;
