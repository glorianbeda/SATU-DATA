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

const CategoriesList = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, category: null });

  const userRole = JSON.parse(localStorage.getItem('userRole') || '{}');

  const canManageInventory = hasPermission(userRole, 'canManageInventory');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(INVENTORY_API.GET_CATEGORIES);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (name, code) => {
    try {
      await api.post(INVENTORY_API.CREATE_CATEGORY, { name, code });
      showSuccess(t('inventory.category_created'));
      fetchCategories();
      setDialog({ open: false, category: null });
    } catch (error) {
      console.error('Error creating category:', error);
      showError(t('inventory.error_creating_category'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(INVENTORY_API.DELETE_CATEGORY(id));
      showSuccess(t('inventory.category_deleted'));
      fetchCategories();
      setDialog({ open: false, category: null });
    } catch (error) {
      console.error('Error deleting category:', error);
      showError(t('inventory.error_deleting_category'));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!canManageInventory) {
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
        {t('inventory.category_management')}
      </Typography>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('inventory.name')}</TableCell>
              <TableCell>{t('inventory.code')}</TableCell>
              <TableCell>{t('inventory.created_at')}</TableCell>
              <TableCell>{t('inventory.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {t('inventory.loading')}
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {t('inventory.no_categories')}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.code}</TableCell>
                  <TableCell>{new Date(cat.createdAt).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setDialog({ open: true, category: cat, mode: 'edit' })}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDialog({ open: true, category: cat, mode: 'delete' })}
                    >
                      <DeleteIcon />
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
        onClick={() => setDialog({ open: true, category: null, mode: 'create' })}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, category: null })} maxWidth="sm">
        <DialogTitle>
          {dialog.mode === 'create' ? t('inventory.add_category') : t('inventory.edit_category')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label={t('inventory.name')}
            defaultValue={dialog.category?.name || ''}
            inputRef={(input) => input && input.focus()}
          />
          <TextField
            fullWidth
            label={t('inventory.code')}
            defaultValue={dialog.category?.code || ''}
            sx={{ mt: 2 }}
            disabled={dialog.mode === 'edit'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, category: null })}>
            {t('inventory.cancel')}
          </Button>
          {dialog.mode === 'delete' ? (
            <Button onClick={() => handleDelete(dialog.category.id)} color="error" variant="contained">
              {t('inventory.delete')}
            </Button>
          ) : (
            <Button
              onClick={() => handleCreate(
                document.getElementById('category-name').value,
                document.getElementById('category-code').value
              )}
              color="primary"
              variant="contained"
            >
              {t('inventory.save')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesList;
