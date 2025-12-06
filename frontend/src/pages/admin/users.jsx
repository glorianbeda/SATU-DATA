import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, CircularProgress, Alert, Chip
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import DashboardLayout from '~/features/dashboard/components/DashboardLayout';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/approve`, 
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/reject`, 
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <Box className="p-6">
        <Typography variant="h4" className="font-bold mb-6 text-gray-800 dark:text-white">
          User Management
        </Typography>
        <Typography variant="body1" className="text-gray-500 mb-6">
          Approve or reject pending user registrations
        </Typography>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        {loading ? (
          <Box className="flex justify-center py-12">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} className="shadow-sm">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Registered</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label="Pending" color="warning" size="small" />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckIcon />}
                        onClick={() => handleApprove(user.id)}
                        disabled={actionLoading === user.id}
                        sx={{ mr: 1 }}
                      >
                        {actionLoading === user.id ? <CircularProgress size={16} /> : 'Approve'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CloseIcon />}
                        onClick={() => handleReject(user.id)}
                        disabled={actionLoading === user.id}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No pending users
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default UserManagement;
