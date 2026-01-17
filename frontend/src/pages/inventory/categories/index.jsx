import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '~/utils/api';
import { INVENTORY_API } from '~/features/inventory/constants';
import { hasPermission } from '~/config/roles';
import { useAlert } from '~/context/AlertContext';

const CategoriesList = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlert();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState({ open: false, category: null, mode: 'create' });
  const [formData, setFormData] = useState({ name: '', code: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
  const canManageCategories = hasPermission(userRole, 'isSuperAdmin');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(INVENTORY_API.GET_CATEGORIES);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError(t('common.error_loading_data'));
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (mode, category = null) => {
    setFormData({
      name: category?.name || '',
      code: category?.code || '',
    });
    setDialog({ open: true, category, mode });
  };

  const closeDialog = () => {
    setDialog({ open: false, category: null, mode: 'create' });
    setFormData({ name: '', code: '' });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      showError(t('inventory.fill_required_fields', 'Please fill all required fields'));
      return;
    }

    setSaving(true);
    try {
      if (dialog.mode === 'edit') {
        await api.put(INVENTORY_API.UPDATE_CATEGORY(dialog.category.id), formData);
        showSuccess(t('inventory.category_updated', 'Category updated successfully'));
      } else {
        await api.post(INVENTORY_API.CREATE_CATEGORY, formData);
        showSuccess(t('inventory.category_created', 'Category created successfully'));
      }
      fetchCategories();
      closeDialog();
    } catch (error) {
      console.error('Error saving category:', error);
      showError(t('inventory.error_saving_category', 'Failed to save category'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(INVENTORY_API.DELETE_CATEGORY(dialog.category.id));
      showSuccess(t('inventory.category_deleted', 'Category deleted successfully'));
      fetchCategories();
      closeDialog();
    } catch (error) {
      console.error('Error deleting category:', error);
      showError(t('inventory.error_deleting_category', 'Failed to delete category'));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!canManageCategories) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {t('inventory.access_denied')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('inventory.category_management', 'Category Management')}
      </Typography>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('inventory.name', 'Name')}</TableCell>
              <TableCell>{t('inventory.code', 'Code')}</TableCell>
              <TableCell>{t('inventory.created_at', 'Created At')}</TableCell>
              <TableCell width={120}>{t('common.actions', 'Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  {t('inventory.no_categories', 'No categories found')}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      {cat.code}
                    </code>
                  </TableCell>
                  <TableCell>{new Date(cat.createdAt).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openDialog('edit', cat)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => openDialog('delete', cat)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        aria-label={t('inventory.add_category')}
        onClick={() => openDialog('create')}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.open && dialog.mode !== 'delete'} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialog.mode === 'create' 
            ? t('inventory.add_category', 'Add Category') 
            : t('inventory.edit_category', 'Edit Category')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label={t('inventory.name', 'Name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label={t('inventory.code', 'Code')}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              disabled={dialog.mode === 'edit'}
              helperText={dialog.mode === 'edit' ? t('inventory.code_cannot_change', 'Code cannot be changed') : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialog.open && dialog.mode === 'delete'} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{t('common.confirm_delete', 'Confirm Delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('inventory.confirm_delete_category', 'Are you sure you want to delete this category?')}
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {t('inventory.delete_category_warning', 'Assets in this category may be affected.')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesList;

