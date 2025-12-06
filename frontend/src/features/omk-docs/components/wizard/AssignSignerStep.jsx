import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Chip, Avatar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import DrawIcon from '@mui/icons-material/Draw';
import axios from 'axios';

const ANNOTATION_TYPES = {
  SIGNATURE: 'signature',
  DATE: 'date',
  TEXT: 'text',
  INITIAL: 'initial'
};

const AssignSignerStep = ({ annotations, signers, onSignersChange }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get signature annotations that need signers
  const signatureAnnotations = annotations.filter(a => 
    a.type === ANNOTATION_TYPES.SIGNATURE || a.type === ANNOTATION_TYPES.INITIAL
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
        // Mock users as fallback
        setUsers([
          { id: 1, name: 'Super Admin', email: 'superadmin@satudata.com' },
          { id: 2, name: 'Admin User', email: 'admin@satudata.com' },
          { id: 3, name: 'Member User', email: 'member@satudata.com' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSignerChange = (annotationId, userId) => {
    const existingIndex = signers.findIndex(s => s.annotationId === annotationId);
    const user = users.find(u => u.id === userId);
    
    if (existingIndex >= 0) {
      const updated = [...signers];
      updated[existingIndex] = { annotationId, userId, user };
      onSignersChange(updated);
    } else {
      onSignersChange([...signers, { annotationId, userId, user }]);
    }
  };

  const getSignerForAnnotation = (annotationId) => {
    const signer = signers.find(s => s.annotationId === annotationId);
    return signer?.userId || '';
  };

  return (
    <Box className="space-y-6">
      <Box className="text-center mb-8">
        <Typography variant="h5" className="font-bold text-gray-800 dark:text-white mb-2">
          Pilih Penanda Tangan
        </Typography>
        <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
          Pilih siapa yang harus menandatangani setiap field
        </Typography>
      </Box>

      {signatureAnnotations.length === 0 ? (
        <Alert severity="warning" className="rounded-xl">
          Tidak ada field tanda tangan. Kembali dan tambahkan minimal satu field tanda tangan atau paraf.
        </Alert>
      ) : (
        <Box className="space-y-4">
          {signatureAnnotations.map((annotation, index) => (
            <Paper 
              key={annotation.id} 
              elevation={0} 
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors"
            >
              <Box className="flex items-center gap-4">
                {/* Annotation Info */}
                <Box 
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${annotation.type === ANNOTATION_TYPES.SIGNATURE 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
                    }
                  `}
                >
                  <DrawIcon />
                </Box>
                
                <Box className="flex-1">
                  <Typography variant="subtitle1" className="font-semibold text-gray-800 dark:text-white">
                    {annotation.type === ANNOTATION_TYPES.SIGNATURE 
                      ? 'Field Tanda Tangan'
                      : 'Field Paraf'
                    } #{index + 1}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Halaman {annotation.page} • Posisi ({Math.round(annotation.position.x)}, {Math.round(annotation.position.y)})
                  </Typography>
                </Box>

                <FormControl size="small" className="w-64">
                  <InputLabel>Pilih Penanda Tangan</InputLabel>
                  <Select
                    value={getSignerForAnnotation(annotation.id)}
                    label="Pilih Penanda Tangan"
                    onChange={(e) => handleSignerChange(annotation.id, e.target.value)}
                  >
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        <Box className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 text-xs bg-blue-600">
                            {user.name?.charAt(0) || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{user.name}</Typography>
                            <Typography variant="caption" className="text-gray-500">{user.email}</Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Selected Signer Chip */}
              {getSignerForAnnotation(annotation.id) && (
                <Box className="mt-3 pl-16">
                  <Chip
                    icon={<PersonIcon className="text-sm" />}
                    label={users.find(u => u.id === getSignerForAnnotation(annotation.id))?.name || 'Unknown'}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}

      <Paper elevation={0} className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 mt-6">
        <Typography variant="subtitle2" className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Ringkasan Penugasan
        </Typography>
        <Box className="flex gap-4">
          <Chip 
            label={`${signatureAnnotations.length} field`} 
            size="small" 
            className="bg-blue-100 dark:bg-blue-800"
          />
          <Chip 
            label={`${signers.length} ditugaskan`} 
            size="small" 
            color={signers.length === signatureAnnotations.length ? 'success' : 'warning'}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AssignSignerStep;
