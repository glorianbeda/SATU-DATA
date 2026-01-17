import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CloudUpload,
  Image as ImageIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import GradientDialog from '~/components/GradientDialog';

const TransactionModal = ({ open, onClose, onSave, type, initialData }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: '',
    type: type || 'INCOME',
    proof: null
  });
  const [dragActive, setDragActive] = useState(false);

  // Determine if it is income or expense
  // Use existing logic: if initialData exists, check its type. Else check prop or formData.
  // Note: Parent usually passes 'type' prop ('INCOME' or 'EXPENSE') when opening for new.
  // When editing, we rely on initialData.type.
  const isIncome = (initialData?.type || formData.type || type) === 'INCOME';
  const themeColor = isIncome ? 'green' : 'red'; // Matches GradientDialog themes
  const Icon = isIncome ? TrendingUp : TrendingDown;

  const categories = isIncome
    ? ['Sponsorship', 'Donasi', 'Penjualan', 'Lainnya']
    : ['Operasional', 'Konsumsi', 'Transportasi', 'Perlengkapan', 'Lainnya'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0],
        amount: initialData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        proof: null
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: '',
        type: type || 'INCOME',
        proof: null
      });
    }
  }, [initialData, type, open]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'proof') {
      setFormData(prev => ({ ...prev, proof: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, proof: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Strip dots from amount before saving
    const cleanData = {
      ...formData,
      amount: formData.amount.toString().replace(/\./g, '')
    };
    onSave(cleanData);
  };

  const actions = (
    <>
      <Button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {t('common.cancel')}
      </Button>
      <Button
        type="submit"
        variant="contained"
        className={`px-6 py-2 rounded-lg shadow-lg shadow-${themeColor}-500/30 bg-gradient-to-r ${isIncome ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-red-600'} hover:shadow-xl transition-all`}
        onClick={handleSubmit} // Start submit manually since button is outside form
      >
        {t('common.save')}
      </Button>
    </>
  );

  return (
    <GradientDialog
      open={open}
      onClose={onClose}
      title={initialData
        ? t('finance.edit_transaction')
        : (isIncome ? t('finance.add_income') : t('finance.add_expense'))}
      icon={<Icon />}
      theme={isIncome ? 'green' : 'red'}
      actions={actions}
    >
      <form onSubmit={handleSubmit} id="transaction-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
          <div className="col-span-1">
            <TextField
              fullWidth
              label={t('common.date')}
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
              className="bg-white dark:bg-gray-800"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </div>

          <div className="col-span-1">
            <FormControl fullWidth required>
              <InputLabel>{t('common.category')}</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label={t('common.category')}
                onChange={handleChange}
                className="bg-white dark:bg-gray-800 rounded-xl"
                sx={{ borderRadius: 2 }}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <TextField
              fullWidth
              label={t('common.amount')}
              type="text"
              name="amount"
              value={formData.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                setFormData(prev => ({ ...prev, amount: formatted }));
              }}
              required
              InputProps={{
                startAdornment: <span className="mr-1 text-gray-500">Rp</span>
              }}
              className="bg-white dark:bg-gray-800"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <TextField
              fullWidth
              label={t('common.description')}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={2}
              className="bg-white dark:bg-gray-800"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </div>

          {/* Custom File Upload */}
          <div className="col-span-1 sm:col-span-2">
            <Typography variant="subtitle2" className="mb-2 text-gray-600 dark:text-gray-400">
              {t('finance.upload_proof') || 'Upload Proof'}
            </Typography>
            <Box
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                dragActive
                  ? `border-${themeColor}-500 bg-${themeColor}-50 dark:bg-${themeColor}-900/20`
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('proof-upload').click()}
            >
              <input
                id="proof-upload"
                type="file"
                hidden
                name="proof"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.proof ? (
                <Box className="flex flex-col items-center gap-2">
                  <div className={`p-3 rounded-full bg-${themeColor}-100 dark:bg-${themeColor}-900/30 text-${themeColor}-600`}>
                    <ImageIcon />
                  </div>
                  <Typography variant="body2" className="font-medium text-gray-700 dark:text-gray-200">
                    {formData.proof.name}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    {(formData.proof.size / 1024).toFixed(0)} KB
                  </Typography>
                </Box>
              ) : (
                <Box className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400">
                    <CloudUpload />
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    Drag & drop or click to upload
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Supports JPG, PNG, WEBP
                  </Typography>
                </Box>
              )}
            </Box>
          </div>
        </div>
      </form>
    </GradientDialog>
  );
};

export default TransactionModal;
