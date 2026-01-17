import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import GradientDialog from '~/components/GradientDialog';

const EditLoanDialog = ({ open, onClose, loan, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: 'PENDING',
    requestDate: null,
    borrowedDate: null,
    dueDate: null,
    returnedDate: null,
    notes: ''
  });

  useEffect(() => {
    if (loan) {
      setFormData({
        status: loan.status,
        requestDate: loan.requestDate ? new Date(loan.requestDate) : null,
        borrowedDate: loan.borrowedDate ? new Date(loan.borrowedDate) : null,
        dueDate: loan.dueDate ? new Date(loan.dueDate) : null,
        returnedDate: loan.returnedDate ? new Date(loan.returnedDate) : null,
        notes: loan.notes || ''
      });
    }
  }, [loan]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(INVENTORY_API.UPDATE_LOAN(loan.id), formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating loan:', error);
      alert('Failed to update loan');
    } finally {
      setLoading(false);
    }
  };

  const textFieldProps = {
    fullWidth: true,
    size: 'medium',
    className: "bg-white dark:bg-gray-800",
    sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }
  };

  const actions = (
    <>
      <Button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        disabled={loading}
      >
        {t('common.cancel')}
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        className="px-6 py-2 rounded-lg shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl transition-all"
        onClick={handleSubmit}
      >
        {loading ? t('common.saving') : t('common.save')}
      </Button>
    </>
  );

  return (
    <GradientDialog
      open={open}
      onClose={onClose}
      title={t('inventory.edit_loan', 'Edit Peminjaman')}
      icon={<EditIcon />}
      theme="blue"
      loading={loading}
      actions={actions}
    >
      <form onSubmit={handleSubmit} id="edit-loan-form">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            {/* Status - Full Width */}
            <div className="col-span-1 sm:col-span-2">
              <FormControl fullWidth required>
                <InputLabel>{t('inventory.status')}</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label={t('inventory.status')}
                  onChange={handleChange}
                  className="bg-white dark:bg-gray-800"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="PENDING">{t('inventory.pending')}</MenuItem>
                  <MenuItem value="APPROVED">{t('inventory.approved')}</MenuItem>
                  <MenuItem value="BORROWED">{t('inventory.borrowed')}</MenuItem>
                  <MenuItem value="RETURN_VERIFICATION">{t('inventory.return_verification')}</MenuItem>
                  <MenuItem value="RETURNED">{t('inventory.returned')}</MenuItem>
                  <MenuItem value="REJECTED">{t('inventory.rejected')}</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Request Date */}
            <div className="col-span-1">
              <DatePicker
                label={t('inventory.request_date')}
                value={formData.requestDate}
                onChange={(newValue) => handleDateChange('requestDate', newValue)}
                slotProps={{ textField: textFieldProps }}
              />
            </div>

            {/* Due Date */}
            <div className="col-span-1">
              <DatePicker
                label={t('inventory.due_date')}
                value={formData.dueDate}
                onChange={(newValue) => handleDateChange('dueDate', newValue)}
                slotProps={{ textField: textFieldProps }}
              />
            </div>

            {/* Borrowed Date */}
            <div className="col-span-1">
              <DatePicker
                label={t('inventory.borrowed_date')}
                value={formData.borrowedDate}
                onChange={(newValue) => handleDateChange('borrowedDate', newValue)}
                slotProps={{ textField: textFieldProps }}
              />
            </div>

            {/* Returned Date */}
            <div className="col-span-1">
              <DatePicker
                label={t('inventory.returned_date')}
                value={formData.returnedDate}
                onChange={(newValue) => handleDateChange('returnedDate', newValue)}
                slotProps={{ textField: textFieldProps }}
              />
            </div>

            {/* Notes - Full Width */}
            <div className="col-span-1 sm:col-span-2">
               <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('inventory.notes')}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="bg-white dark:bg-gray-800"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
               />
            </div>
          </div>
        </LocalizationProvider>
      </form>
    </GradientDialog>
  );
};

export default EditLoanDialog;
