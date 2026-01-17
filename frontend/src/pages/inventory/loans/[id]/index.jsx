import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import { hasPermission } from '~/config/roles';

import LoanTimeline from '~/features/inventory/components/LoanTimeline';
import ReturnAssetDialog from '~/features/inventory/components/ReturnAssetDialog';
import VerifyReturnDialog from '~/features/inventory/components/VerifyReturnDialog';
import { VerifiedUser as VerifyIcon, ImageNotSupported as ImageNotSupportedIcon } from '@mui/icons-material';

const LoanDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnDialog, setReturnDialog] = useState(false);
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [assetImageError, setAssetImageError] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') 
      ? url 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}${url}`;
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'KOORDINATOR_INVENTARIS'].includes(userRole.name);
  const canApproveLoans = hasPermission(userRole, 'canApproveLoans');

  const fetchLoan = async () => {
    try {
      setLoading(true);
      const response = await api.get(INVENTORY_API.GET_LOAN(id));
      setLoan(response.data.loan);
    } catch (error) {
      console.error('Error fetching loan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await api.put(INVENTORY_API.APPROVE_LOAN(id));
      setLoan({ ...loan, status: 'APPROVED', approvedDate: new Date() });
    } catch (error) {
      console.error('Error approving loan:', error);
      alert(t('common.error'));
    }
  };

  const handleReject = async () => {
    const reason = prompt(t('inventory.rejection_reason'));
    if (!reason) return;

    try {
      await api.put(INVENTORY_API.REJECT_LOAN(id), { notes: reason });
      setLoan({ ...loan, status: 'REJECTED' });
    } catch (error) {
      console.error('Error rejecting loan:', error);
      alert(t('common.error'));
    }
  };

  const handleBorrow = async () => {
    try {
      await api.put(INVENTORY_API.BORROW_LOAN(id));
      setLoan({ ...loan, status: 'BORROWED', borrowedDate: new Date() });
    } catch (error) {
      console.error('Error marking as borrowed:', error);
      alert(t('common.error'));
    }
  };

  useEffect(() => {
    fetchLoan();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loan) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t('common.error')}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/inventory/loans')}
        sx={{ mb: 2 }}
      >
        {t('common.back')}
      </Button>

      <Typography variant="h4" gutterBottom>
        {t('inventory.loan_details')} #{loan.id}
      </Typography>

      <LoanTimeline status={loan.status} />

      <Grid container spacing={3}>
        {/* Loan Info */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Loan Info */}
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {t('inventory.loan_info')}
                  </Typography>
                  <Chip 
                    label={t(`inventory.${loan.status.toLowerCase()}`)}
                    color={
                      loan.status === 'PENDING' ? 'info' :
                      loan.status === 'APPROVED' ? 'warning' :
                      loan.status === 'BORROWED' ? 'success' :
                      loan.status === 'RETURN_VERIFICATION' ? 'warning' :
                      loan.status === 'RETURNED' ? 'default' :
                      'error'
                    }
                    size="small"
                    sx={{ ml: 2, fontWeight: 'bold' }}
                  />
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                        {t('inventory.asset')}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {loan.asset?.name || '-'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {loan.asset?.assetCode}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                        {t('inventory.borrower')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {loan.borrower?.name || '-'}
                        </Typography>
                        <Chip label={loan.borrower?.role?.name || 'USER'} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {loan.borrower?.email}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}><Divider /></Grid>

                  <Grid item xs={6} md={3}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      {t('inventory.request_date')}
                    </Typography>
                    <Typography variant="body2">
                      {new Date(loan.requestDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      {t('inventory.due_date')}
                    </Typography>
                    <Typography variant="body2" color={loan.dueDate && new Date(loan.dueDate) < new Date() && loan.status === 'BORROWED' ? 'error.main' : 'text.primary'}>
                      {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                     <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      {t('inventory.approved_date')}
                    </Typography>
                    <Typography variant="body2">
                      {loan.approvedDate ? new Date(loan.approvedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                     <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      {t('inventory.borrowed_date')}
                    </Typography>
                    <Typography variant="body2">
                      {loan.borrowedDate ? new Date(loan.borrowedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </Typography>
                  </Grid>

                  {loan.returnedDate && (
                    <Grid item xs={6} md={3}>
                       <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                        {t('inventory.returned_date')}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(loan.returnedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}><Divider /></Grid>

                  <Grid item xs={12}>
                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      {loan.status === 'REJECTED' ? t('inventory.rejection_reason', 'Alasan Penolakan') : t('inventory.notes')}
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="body2" color={!loan.notes ? 'text.secondary' : 'text.primary'} fontStyle={!loan.notes ? 'italic' : 'normal'}>
                        {loan.notes || t('inventory.no_notes', 'Tidak ada catatan')}
                      </Typography>
                    </Paper>
                  </Grid>

                  {loan.returnProofImage && (
                      <Grid item xs={12}>
                          <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 1 }}>
                              {t('inventory.return_proof')}
                          </Typography>
                          <Box 
                            sx={{ 
                              width: '100%', 
                              maxHeight: 300, 
                              borderRadius: 2, 
                              overflow: 'hidden', 
                              border: '1px solid',
                              borderColor: 'divider',
                              cursor: 'pointer',
                              bgcolor: 'grey.100',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onClick={() => window.open(getImageUrl(loan.returnProofImage), '_blank')}
                          >
                              <img 
                                  src={getImageUrl(loan.returnProofImage)} 
                                  alt="Return Proof" 
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              />
                          </Box>
                      </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Asset Details Spec (Moved here for better width) */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {t('inventory.asset_details')}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box 
                      sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        height: 200, 
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        color: 'text.disabled'
                      }}
                    >
                      {loan.asset?.imageUrl && !assetImageError ? (
                        <img
                          src={getImageUrl(loan.asset.imageUrl)}
                          alt={loan.asset.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={() => setAssetImageError(true)}
                        />
                      ) : (
                         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                           <ImageNotSupportedIcon sx={{ fontSize: 60 }} />
                           <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                             {t('inventory.no_image', 'No Image')}
                           </Typography>
                         </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ color: 'text.secondary', border: 0, pl: 0, width: '30%' }}>
                              {t('inventory.name')}
                            </TableCell>
                            <TableCell align="left" sx={{ border: 0, paddingLeft: 1, fontWeight: 'medium' }}>
                              {loan.asset?.name || '-'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ color: 'text.secondary', border: 0, pl: 0 }}>
                              {t('inventory.category')}
                            </TableCell>
                            <TableCell align="left" sx={{ border: 0, paddingLeft: 1, fontWeight: 'medium' }}>
                              {loan.asset?.category?.name || '-'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ color: 'text.secondary', border: 0, pl: 0 }}>
                              {t('inventory.brand')}
                            </TableCell>
                            <TableCell align="left" sx={{ border: 0, paddingLeft: 1, fontWeight: 'medium' }}>
                              {loan.asset?.brand || '-'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ color: 'text.secondary', border: 0, pl: 0 }}>
                              {t('inventory.model')}
                            </TableCell>
                            <TableCell align="left" sx={{ border: 0, paddingLeft: 1, fontWeight: 'medium' }}>
                              {loan.asset?.model || '-'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ color: 'text.secondary', border: 0, pl: 0 }}>
                              {t('inventory.location')}
                            </TableCell>
                            <TableCell align="left" sx={{ border: 0, paddingLeft: 1, fontWeight: 'medium' }}>
                              {loan.asset?.location || '-'}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Actions */}
            <Card elevation={2} sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {t('inventory.actions')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {/* Admin Actions */}
                  {isAdmin && loan.status === 'PENDING' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={handleApprove}
                        fullWidth
                        size="large"
                      >
                        {t('inventory.approve')}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={handleReject}
                        fullWidth
                        size="large"
                      >
                        {t('inventory.reject')}
                      </Button>
                    </>
                  )}

                  {/* Mark as Borrowed (Admin) */}
                  {isAdmin && loan.status === 'APPROVED' && (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handleBorrow}
                      fullWidth
                      size="large"
                    >
                      {t('inventory.borrow')}
                    </Button>
                  )}

                  {/* Verify Return (Admin) */}
                  {isAdmin && loan.status === 'RETURN_VERIFICATION' && (
                     <Button
                        variant="contained"
                        color="warning"
                        startIcon={<VerifyIcon />}
                        onClick={() => setVerifyDialog(true)}
                        fullWidth
                        size="large"
                     >
                        {t('inventory.verify_return')}
                     </Button>
                  )}

                  {/* Return (Borrower or Admin) */}
                  {(loan.status === 'BORROWED') && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setReturnDialog(true)}
                      fullWidth
                      size="large"
                    >
                      {t('inventory.return')}
                    </Button>
                  )}
                  
                  {/* Informational States */}
                  {['PENDING'].includes(loan.status) && !isAdmin && (
                    <Alert severity="info" variant="outlined">
                      {t('inventory.waiting_approval', 'Menunggu persetujuan admin')}
                    </Alert>
                  )}

                  {['APPROVED'].includes(loan.status) && !isAdmin && (
                    <Alert severity="info" variant="outlined">
                      {t('inventory.waiting_collection', 'Silakan ambil aset dan tunggu admin konfirmasi')}
                    </Alert>
                  )}

                  {['RETURN_VERIFICATION'].includes(loan.status) && !isAdmin && (
                    <Alert severity="warning" variant="outlined">
                       {t('inventory.waiting_verification', 'Menunggu verifikasi pengembalian')}
                    </Alert>
                  )}

                  {['RETURNED'].includes(loan.status) && (
                    <Alert severity="success" variant="filled">
                       {t('inventory.loan_completed', 'Peminjaman selesai')}
                    </Alert>
                  )}

                  {['REJECTED'].includes(loan.status) && (
                    <Alert severity="error" variant="filled">
                       {t('inventory.loan_rejected', 'Permintaan ditolak')}
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <ReturnAssetDialog
        open={returnDialog}
        onClose={() => setReturnDialog(false)}
        loan={loan}
        onSuccess={fetchLoan}
      />

      <VerifyReturnDialog
        open={verifyDialog}
        onClose={() => setVerifyDialog(false)}
        loan={loan}
        onSuccess={fetchLoan}
      />
    </Box>
  );
};

export default LoanDetails;
