import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Button, CircularProgress, Chip, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, IconButton, Alert
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { useLayout } from '~/context/LayoutContext';
import { DataTable } from '~/components/DataTable';
import { useAlert } from '~/context/AlertContext';
import { useTheme } from '~/context/ThemeContext';
import { RoleRoute } from '~/components/RouteGuard';

const UserManagement = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  useEffect(() => {
    setTitle(t('user_management.title'));
  }, [t, setTitle]);

  const [tabValue, setTabValue] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [roleConfirmDialog, setRoleConfirmDialog] = useState({ open: false, user: null, roleId: null, roleName: '' });

  const { showSuccess, showError } = useAlert();

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/pending`, {
        withCredentials: true
      });
      setPendingUsers(response.data.users);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to fetch pending users');
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        withCredentials: true
      });
      setAllUsers(response.data.users);
      setRoles(response.data.roles || []);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to fetch users');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPendingUsers(), fetchAllUsers()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/approve`,
        { userId },
        { withCredentials: true }
      );
      showSuccess('User approved and verification email sent');
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      fetchAllUsers();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    setActionLoading(userId);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/reject`,
        { userId },
        { withCredentials: true }
      );
      showSuccess('User rejected');
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      fetchAllUsers();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId, roleId) => {
    // Find the role name
    const selectedRole = roles.find(r => r.id === roleId);

    // If promoting to Super Admin, show confirmation dialog
    if (selectedRole?.name === 'SUPER_ADMIN') {
      const user = allUsers.find(u => u.id === userId);
      setRoleConfirmDialog({
        open: true,
        user,
        roleId,
        roleName: selectedRole.name
      });
      return;
    }

    // Otherwise proceed directly
    await executeRoleChange(userId, roleId);
  };

  const executeRoleChange = async (userId, roleId) => {
    setActionLoading(userId);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/role`,
        { roleId },
        { withCredentials: true }
      );
      showSuccess('User role updated');
      fetchAllUsers();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to update role');
    } finally {
      setActionLoading(null);
      setRoleConfirmDialog({ open: false, user: null, roleId: null, roleName: '' });
    }
  };

  const handleResendVerification = async (userId) => {
    setActionLoading(userId);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/${userId}/resend-verification`, {},
        { withCredentials: true }
      );
      showSuccess('Verification email sent');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to send verification email');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditSave = async () => {
    const { user } = editDialog;
    setActionLoading(user.id);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
        { name: user.name, email: user.email },
        { withCredentials: true }
      );
      showSuccess('User updated successfully');
      setEditDialog({ open: false, user: null });
      fetchAllUsers();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to update user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    const { user } = deleteDialog;
    setActionLoading(user.id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
        { withCredentials: true }
      );
      showSuccess('User deleted successfully');
      setDeleteDialog({ open: false, user: null });
      fetchAllUsers();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusChip = (status) => {
    const config = {
      PENDING: { color: 'warning', label: 'Pending' },
      APPROVED: { color: 'info', label: 'Approved' },
      VERIFIED: { color: 'success', label: 'Verified' },
      REJECTED: { color: 'error', label: 'Rejected' },
      DELETED: { color: 'default', label: 'Deleted' },
    };
    const { color, label } = config[status] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" />;
  };

  const pendingColumns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'createdAt',
      headerName: 'Registered',
      width: 150,
      renderCell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      exportable: false,
      renderCell: () => <Chip label="Pending" color="warning" size="small" />
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      exportable: false,
      renderCell: (row) => (
        <Box className="flex gap-2">
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={actionLoading === row.id ? <CircularProgress size={14} color="inherit" /> : <CheckIcon />}
            onClick={() => handleApprove(row.id)}
            disabled={actionLoading === row.id}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={() => handleReject(row.id)}
            disabled={actionLoading === row.id}
          >
            Reject
          </Button>
        </Box>
      )
    },
  ];

  const allUsersColumns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 220 },
    {
      field: 'role',
      headerName: 'Role',
      width: 180,
      sortable: false,
      exportable: false,
      renderCell: (row) => (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={row.role?.id || ''}
            onChange={(e) => handleRoleChange(row.id, e.target.value)}
            disabled={actionLoading === row.id}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
      valueGetter: (row) => row.role?.name || '-'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      exportable: false,
      renderCell: (row) => getStatusChip(row.status),
      valueGetter: (row) => row.status
    },
    {
      field: 'createdAt',
      headerName: 'Registered',
      width: 120,
      renderCell: (row) => new Date(row.createdAt).toLocaleDateString(),
      valueGetter: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      exportable: false,
      renderCell: (row) => (
        <Box className="flex gap-1">
          {row.status === 'APPROVED' && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleResendVerification(row.id)}
              disabled={actionLoading === row.id}
              title="Resend Verification"
            >
              <EmailIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            color="info"
            onClick={() => setEditDialog({ open: true, user: { ...row } })}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteDialog({ open: true, user: row })}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    },
  ];

  return (
      <Box className="p-2">
        <Typography variant="body1" className="text-gray-500 dark:text-gray-400 mb-4">
          {t('user_management.subtitle')}
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          className="mb-4"
          sx={{
            '& .MuiTab-root': {
              color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
            },
            '& .Mui-selected': {
              color: isDark ? 'rgb(96, 165, 250) !important' : 'primary.main',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isDark ? 'rgb(96, 165, 250)' : 'primary.main',
            },
          }}
        >
          <Tab label={`${t('user_management.pending_users')} (${pendingUsers.length})`} />
          <Tab label={`${t('user_management.all_users')} (${allUsers.length})`} />
        </Tabs>

        {tabValue === 0 && (
          <DataTable
            columns={pendingColumns}
            data={pendingUsers}
            loading={loading}
            title={t('user_management.pending_registrations')}
            emptyMessage={t('user_management.no_pending_users')}
            exportable={true}
            searchable={true}
            pagination={true}
          />
        )}

        {tabValue === 1 && (
          <DataTable
            columns={allUsersColumns}
            data={allUsers}
            loading={loading}
            title={t('user_management.all_users')}
            emptyMessage={t('user_management.no_users_found')}
            exportable={true}
            searchable={true}
            pagination={true}
          />
        )}

        {/* Edit Dialog */}
        <Dialog
          open={editDialog.open}
          onClose={() => setEditDialog({ open: false, user: null })}
          PaperProps={{
            className: "dark:bg-gray-800"
          }}
        >
          <DialogTitle className="dark:text-white">{t('user_management.edit_user')}</DialogTitle>
          <DialogContent className="pt-4">
            <TextField
              fullWidth
              label={t('user_management.name')}
              value={editDialog.user?.name || ''}
              onChange={(e) => setEditDialog({ ...editDialog, user: { ...editDialog.user, name: e.target.value } })}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  ".dark &": { color: "white" },
                  ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                },
                "& .MuiInputLabel-root": {
                  ".dark &": { color: "rgba(255, 255, 255, 0.7)" },
                },
              }}
            />
            <TextField
              fullWidth
              label={t('user_management.email')}
              value={editDialog.user?.email || ''}
              onChange={(e) => setEditDialog({ ...editDialog, user: { ...editDialog.user, email: e.target.value } })}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  ".dark &": { color: "white" },
                  ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                },
                "& .MuiInputLabel-root": {
                  ".dark &": { color: "rgba(255, 255, 255, 0.7)" },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ open: false, user: null })} className="dark:text-gray-300">{t('user_management.cancel')}</Button>
            <Button onClick={handleEditSave} variant="contained" disabled={actionLoading}>
              {actionLoading ? <CircularProgress size={20} /> : t('user_management.save')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, user: null })}
          PaperProps={{
            className: "dark:bg-gray-800"
          }}
        >
          <DialogTitle className="dark:text-white">{t('user_management.delete_user')}</DialogTitle>
          <DialogContent>
            <Typography className="dark:text-gray-200">
              {t('user_management.delete_confirm')} <strong>{deleteDialog.user?.name}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mt-2 dark:text-gray-400">
              {t('user_management.delete_note')}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, user: null })} className="dark:text-gray-300">{t('user_management.cancel')}</Button>
            <Button onClick={handleDelete} variant="contained" color="error" disabled={actionLoading}>
              {actionLoading ? <CircularProgress size={20} /> : t('common.delete')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Super Admin Confirmation Dialog */}
        <Dialog
          open={roleConfirmDialog.open}
          onClose={() => setRoleConfirmDialog({ open: false, user: null, roleId: null, roleName: '' })}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            className: "dark:bg-gray-800"
          }}
        >
          <DialogTitle sx={{ color: 'warning.main' }}>
            ⚠️ {t('user_management.promote_super_admin')}
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" className="mb-4">
              <strong>{t('common.warning')}:</strong> {t('user_management.super_admin_warning')}
            </Alert>
            <Typography className="mb-2 dark:text-gray-200">
              {t('user_management.promote_confirm')} <strong>{roleConfirmDialog.user?.name}</strong> ({roleConfirmDialog.user?.email}) {t('user_management.to_super_admin')}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="dark:text-gray-400">
              {t('user_management.super_admin_access')}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setRoleConfirmDialog({ open: false, user: null, roleId: null, roleName: '' })}
              className="dark:text-gray-300"
            >
              {t('user_management.cancel')}
            </Button>
            <Button
              onClick={() => executeRoleChange(roleConfirmDialog.user?.id, roleConfirmDialog.roleId)}
              variant="contained"
              color="warning"
              disabled={actionLoading}
            >
              {actionLoading ? <CircularProgress size={20} /> : t('user_management.confirm_promotion')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default function ProtectedUserManagement() {
  return (
    <RoleRoute allowedRoles={['SUPER_ADMIN']}>
      <UserManagement />
    </RoleRoute>
  );
}
