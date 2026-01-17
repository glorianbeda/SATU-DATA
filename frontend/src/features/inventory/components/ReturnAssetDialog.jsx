import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';

const ReturnAssetDialog = ({ open, onClose, loan, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [condition, setCondition] = useState('GOOD');
  const [notes, setNotes] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const cleanUp = () => {
    setFile(null);
    setPreviewUrl(null);
    setCondition('GOOD');
    setNotes('');
    setError(null);
  };

  const handleClose = () => {
    cleanUp();
    onClose();
  };

  const handleSubmit = async () => {
    if (!file) {
      setError(t('inventory.proof_required', 'Photo proof is required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload Image
      const formData = new FormData();
      formData.append('image', file);
      
      const uploadResponse = await api.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const imageUrl = uploadResponse.data.url;

      // 2. Submit Return
      await api.put(`/api/inventory/loans/${loan.id}/return`, {
        returnProofImage: imageUrl,
        returnCondition: condition,
        returnNotes: notes,
      });

      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error("Return error:", err);
      setError(err.response?.data?.error || t('common.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('inventory.return_asset')}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                {t('inventory.asset')}: {loan?.asset?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('inventory.code')}: {loan?.asset?.assetCode}
            </Typography>
        </Box>

        <Box sx={{ mb: 3, textAlign: 'center' }}>
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="return-proof-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="return-proof-file">
                <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
                    {t('inventory.upload_proof')}
                </Button>
            </label>
            {previewUrl && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <img src={previewUrl} alt="Proof" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                </Box>
            )}
        </Box>

        <TextField
            select
            fullWidth
            label={t('inventory.condition')}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            sx={{ mb: 2 }}
        >
            <MenuItem value="GOOD">{t('inventory.condition_good')}</MenuItem>
            <MenuItem value="DAMAGED">{t('inventory.condition_damaged')}</MenuItem>
            <MenuItem value="LOST">{t('inventory.condition_lost')}</MenuItem>
        </TextField>

        <TextField
            fullWidth
            multiline
            rows={3}
            label={t('common.notes')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('inventory.return_notes_placeholder', 'Optional notes...')}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !file}
        >
          {loading ? <CircularProgress size={24} /> : t('inventory.confirm_return')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnAssetDialog;
