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
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Receipt as ReceiptIcon,
  DoneAll,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '~/utils/api';
import { REIMBURSEMENT_API } from '~/features/reimbursement/constants/api';
import { useAlert } from '~/context/AlertContext';
import { useLayout } from '~/context/LayoutContext';
import ModalWrapper from '~/components/ModalWrapper';

const ReimbursementAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { setTitle } = useLayout();
  
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, type: '', data: null });
  const [actionNotes, setActionNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setTitle(t('reimbursement.admin_title', 'Kelola Reimbursement'));
    fetchReimbursements();
  }, [t, filterStatus]);

  const fetchReimbursements = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? `?status=${filterStatus}` : '';
      const response = await api.get(`${REIMBURSEMENT_API.GET_REIMBURSEMENTS}${params}`);
      setReimbursements(response.data.reimbursements || []);
    } catch (error) {
      console.error('Error fetching reimbursements:', error);
      showAlert('Gagal memuat data reimbursement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setProcessing(true);
      await api.put(REIMBURSEMENT_API.APPROVE_REIMBURSEMENT(actionModal.data.id), {
        status: 'APPROVED',
        notes: actionNotes,
      });
      showAlert('Reimbursement berhasil disetujui', 'success');
      setActionModal({ open: false, type: '', data: null });
      setActionNotes('');
      fetchReimbursements();
    } catch (error) {
      console.error('Error approving reimbursement:', error);
      showAlert(error.response?.data?.error || 'Gagal menyetujui reimbursement', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      await api.put(REIMBURSEMENT_API.APPROVE_REIMBURSEMENT(actionModal.data.id), {
        status: 'REJECTED',
        notes: actionNotes,
      });
      showAlert('Reimbursement ditolak', 'success');
      setActionModal({ open: false, type: '', data: null });
      setActionNotes('');
      fetchReimbursements();
    } catch (error) {
      console.error('Error rejecting reimbursement:', error);
      showAlert(error.response?.data?.error || 'Gagal menolak reimbursement', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    try {
      setProcessing(true);
      await api.put(REIMBURSEMENT_API.COMPLETE_REIMBURSEMENT(actionModal.data.id));
      showAlert('Reimbursement ditandai selesai', 'success');
      setActionModal({ open: false, type: '', data: null });
      fetchReimbursements();
    } catch (error) {
      console.error('Error completing reimbursement:', error);
      showAlert(error.response?.data?.error || 'Gagal menyelesaikan reimbursement', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const openActionModal = (item, type) => {
    setSelectedItem(item);
    setActionModal({ open: true, type, data: item });
    setActionNotes('');
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

  // Stats for admin
  const stats = {
    pending: reimbursements.filter(r => r.status === 'PENDING').length,
    approved: reimbursements.filter(r => r.status === 'APPROVED').length,
    completed: reimbursements.filter(r => r.status === 'COMPLETED').length,
    rejected: reimbursements.filter(r => r.status === 'REJECTED').length,
  };

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
          {t('reimbursement.admin_title', 'Kelola Reimbursement')}
        </Typography>
        <TextField
          select
          size="small"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Semua</MenuItem>
          <MenuItem value="PENDING">Menunggu</MenuItem>
          <MenuItem value="APPROVED">Disetujui</MenuItem>
          <MenuItem value="REJECTED">Ditolak</MenuItem>
          <MenuItem value="COMPLETED">Selesai</MenuItem>
        </TextField>
      </Box>

      {/* Stats Cards - Admin View */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
            color: 'white',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
          }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Menunggu
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: 'white',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
          }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Disetujui
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
          }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Selesai
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            color: 'white',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
          }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Ditolak
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.rejected}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>No</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.requester', 'Pemohon')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.amount', 'Jumlah')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.disbursement_method', 'Metode')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.account_number', 'Rek/HP')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.status', 'Status')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('reimbursement.date', 'Tanggal')}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reimbursements.length > 0 ? (
                reimbursements.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    hover
                    sx={{ 
                      '&:hover': { bgcolor: 'grey.50' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{item.user?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.user?.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary.main">{formatCurrency(item.amount)}</Typography>
                    </TableCell>
                    <TableCell>{getMethodLabel(item.disbursementMethod)}</TableCell>
                    <TableCell>{item.accountNumber || '-'}</TableCell>
                    <TableCell>{getStatusChip(item.status)}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell align="center">
                      {item.status === 'PENDING' && (
                        <>
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => openActionModal(item, 'approve')}
                            sx={{ 
                              bgcolor: 'success.light', 
                              color: 'white',
                              '&:hover': { bgcolor: 'success.main' },
                              mr: 1,
                            }}
                            title="Setuju"
                          >
                            <CheckCircle fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => openActionModal(item, 'reject')}
                            sx={{ 
                              bgcolor: 'error.light', 
                              color: 'white',
                              '&:hover': { bgcolor: 'error.main' },
                            }}
                            title="Tolak"
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      {item.status === 'APPROVED' && (
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openActionModal(item, 'complete')}
                          sx={{ 
                            bgcolor: 'primary.main', 
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' },
                          }}
                          title="Tandai Selesai"
                        >
                          <DoneAll fontSize="small" />
                        </IconButton>
                      )}
                      {item.status === 'COMPLETED' && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/reimbursement/${item.id}/receipt`)}
                          sx={{ 
                            bgcolor: 'success.main', 
                            color: 'white',
                            '&:hover': { bgcolor: 'success.dark' },
                          }}
                          title="Lihat Nota"
                        >
                          <ReceiptIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Tidak ada data
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Modal */}
      <ModalWrapper
        open={actionModal.open}
        onClose={() => setActionModal({ open: false, type: '', data: null })}
        title={
          actionModal.type === 'approve' ? 'Setujui Reimbursement' :
          actionModal.type === 'reject' ? 'Tolak Reimbursement' :
          'Selesaikan Reimbursement'
        }
        showSubmit={false}
        maxWidth="sm"
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Detail Permintaan:
          </Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ py: 1.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pemohon</Typography>
                  <Typography variant="body2" fontWeight="bold">{selectedItem?.user?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Jumlah</Typography>
                  <Typography variant="body2" fontWeight="bold">{formatCurrency(selectedItem?.amount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Metode</Typography>
                  <Typography variant="body2">{getMethodLabel(selectedItem?.disbursementMethod)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Rek/HP</Typography>
                  <Typography variant="body2">{selectedItem?.accountNumber || 'Tunai'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {actionModal.type !== 'complete' && (
            <TextField
              label="Catatan"
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder={actionModal.type === 'reject' ? 'Alasan penolakan...' : 'Catatan (opsional)'}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={() => setActionModal({ open: false, type: '', data: null })}>
            Batal
          </Button>
          {actionModal.type === 'approve' && (
            <Button variant="contained" color="success" onClick={handleApprove} disabled={processing}>
              {processing ? 'Memproses...' : 'Setuju'}
            </Button>
          )}
          {actionModal.type === 'reject' && (
            <Button variant="contained" color="error" onClick={handleReject} disabled={processing}>
              {processing ? 'Memproses...' : 'Tolak'}
            </Button>
          )}
          {actionModal.type === 'complete' && (
            <Button variant="contained" color="primary" onClick={handleComplete} disabled={processing}>
              {processing ? 'Memproses...' : 'Tandai Selesai'}
            </Button>
          )}
        </Box>
      </ModalWrapper>
    </Box>
  );
};

export default ReimbursementAdmin;
