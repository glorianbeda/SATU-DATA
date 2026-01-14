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

const LoanDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnDialog, setReturnDialog] = useState(false);
  const [returnData, setReturnData] = useState({ condition: 'GOOD', notes: '' });

  const userRole = JSON.parse(localStorage.getItem('userRole') || '{}');
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole.name);
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

  const handleReturn = async () => {
    try {
      await api.put(INVENTORY_API.RETURN_LOAN(id), {
        returnCondition: returnData.condition,
        returnNotes: returnData.notes,
      });
      setLoan({ ...loan, status: 'RETURNED', returnedDate: new Date() });
      setReturnDialog(false);
      setReturnData({ condition: 'GOOD', notes: '' });
    } catch (error) {
      console.error('Error returning loan:', error);
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
                      loan.status === 'BORROWED' ? 'success' :
                      loan.status === 'RETURNED' ? 'default' :
                      'error'
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
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.approved_date')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.approvedDate ? new Date(loan.approvedDate).toLocaleDateString('id-ID') : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.borrowed_date')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.borrowedDate ? new Date(loan.borrowedDate).toLocaleDateString('id-ID') : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">
                    {t('inventory.returned_date')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loan.returnedDate ? new Date(loan.returnedDate).toLocaleDateString('id-ID') : '-'}
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
                {loan.asset?.imageUrl && (
                  <Grid item xs={12}>
                    <img
                      src={loan.asset.imageUrl}
                      alt={loan.asset.name}
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                  </Grid>
                )}
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

              {/* Admin Actions */}
              {isAdmin && loan.status === 'PENDING' && (
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

              {/* Mark as Borrowed (Admin) */}
              {isAdmin && loan.status === 'APPROVED' && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleBorrow}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {t('inventory.borrow')}
                </Button>
              )}

              {/* Return (Borrower or Admin) */}
              {loan.status === 'BORROWED' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setReturnDialog(true)}
                  fullWidth
                >
                  {t('inventory.return')}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Return Dialog */}
      <Dialog open={returnDialog.open} onClose={() => setReturnDialog(false)} maxWidth="sm">
        <DialogTitle>{t('inventory.return_asset')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{t('inventory.return_condition')}</InputLabel>
            <Select
              value={returnData.condition}
              onChange={(e) => setReturnData({ ...returnData, condition: e.target.value })}
              label={t('inventory.return_condition')}
            >
              <MenuItem value="GOOD">{t('inventory.condition_good')}</MenuItem>
              <MenuItem value="DAMAGED">{t('inventory.condition_damaged')}</MenuItem>
              <MenuItem value="LOST">{t('inventory.condition_lost')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label={t('inventory.return_notes')}
            multiline
            rows={4}
            value={returnData.notes}
            onChange={(e) => setReturnData({ ...returnData, notes: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleReturn}
            variant="contained"
            color="primary"
          >
            {t('inventory.return')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanDetails;
