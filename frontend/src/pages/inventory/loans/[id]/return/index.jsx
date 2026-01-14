import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';

const ReturnInterface = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnData, setReturnData] = useState({ condition: 'GOOD', notes: '' });

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

  const handleReturn = async () => {
    try {
      await api.put(INVENTORY_API.RETURN_LOAN(id), {
        returnCondition: returnData.condition,
        returnNotes: returnData.notes,
      });
      navigate('/inventory/loans');
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
        {t('inventory.return_asset')}
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
                      loan.status === 'BORROWED' ? 'warning' :
                      'default'
                    }
                    size="medium"
                  />
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

        {/* Return Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('inventory.return_asset')}
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleReturn}
              fullWidth
            >
              {t('inventory.return')}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default ReturnInterface;
