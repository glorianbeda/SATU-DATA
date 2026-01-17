import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Grid,
} from '@mui/material';
import { Check as ApproveIcon, Close as RejectIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';

const VerifyReturnDialog = ({ open, onClose, loan, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [returnCondition, setReturnCondition] = useState(loan?.returnCondition || 'GOOD');

  const handleVerify = async (decision) => {
    setLoading(true);
    try {
      await api.put(`/api/inventory/loans/${loan.id}/verify`, {
        decision, // "APPROVE" | "REJECT"
        notes,
        returnCondition: decision === 'APPROVE' ? returnCondition : undefined,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Verification error:', error);
      alert(t('common.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const proofImage = loan?.returnProofImage;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('inventory.verify_return')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              {t('inventory.proof_of_return')}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 300,
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
              }}
            >
              {proofImage ? (
                <img
                  src={proofImage}
                  alt="Return Proof"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Typography color="text.secondary">{t('inventory.no_proof_image')}</Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{t('inventory.asset')}</Typography>
              <Typography variant="body1">{loan?.asset?.name} ({loan?.asset?.assetCode})</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{t('inventory.borrower')}</Typography>
              <Typography variant="body1">{loan?.borrower?.name}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
               <Typography variant="subtitle2">{t('inventory.user_condition_report')}</Typography>
               <Typography variant="body1" fontWeight="bold">
                 {loan?.returnCondition || '-'}
               </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
                 <Typography variant="subtitle2">{t('inventory.user_notes')}</Typography>
                 <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                    {loan?.returnNotes || '-'}
                 </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('inventory.admin_notes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('inventory.verification_notes_placeholder')}
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={() => handleVerify('REJECT')}
          color="error"
          startIcon={<RejectIcon />}
          disabled={loading}
        >
          {t('inventory.reject_return')}
        </Button>
        <Button
          onClick={() => handleVerify('APPROVE')}
          variant="contained"
          color="success"
          startIcon={<ApproveIcon />}
          disabled={loading}
        >
          {t('inventory.approve_return')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyReturnDialog;
