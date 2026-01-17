import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import { hasPermission } from '~/config/roles';

const ApprovalInterface = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
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
      navigate('/inventory/loans');
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

  if (!canApproveLoans) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {t('inventory.access_denied')}
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('inventory.loading')}</Typography>
      </Box>
    );
  }

  if (!loan) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {t('common.error')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<CheckIcon />}
        onClick={() => navigate('/inventory/loans')}
        sx={{ mb: 2 }}
      >
        {t('common.back')}
      </Button>

      <Typography variant="h4" gutterBottom>
        {t('inventory.approve_loan')} #{loan.id}
      </Typography>

      <Grid container spacing={3}>
        {/* Loan Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('inventory.loan_info')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.asset')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    {loan.asset?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.asset_code')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.asset?.assetCode || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.borrower')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.borrower?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.status')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Chip
                    label={t(`inventory.${loan.status.toLowerCase()}`)}
                    color={
                      loan.status === 'PENDING' ? 'info' :
                      loan.status === 'APPROVED' ? 'warning' :
                      'default'
                    }
                    size="medium"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.request_date')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {new Date(loan.requestDate).toLocaleDateString('id-ID')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.due_date')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('id-ID') : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.notes')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    {loan.notes || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Asset Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('inventory.asset_details')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.name')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.asset?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.category')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.asset?.category?.name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.brand')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.asset?.brand || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.model')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.asset?.model || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.serial_number')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.asset?.serialNumber || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.location')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.asset?.location || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('inventory.actions')}
              </Typography>

              {loan.status === 'PENDING' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    onClick={handleApprove}
                    fullWidth
                  >
                    {t('inventory.approve')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleReject}
                    fullWidth
                  >
                    {t('inventory.reject')}
                  </Button>
                </Box>
              )}

              {loan.status === 'APPROVED' && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleBorrow}
                  fullWidth
                >
                  {t('inventory.borrow')}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApprovalInterface;
