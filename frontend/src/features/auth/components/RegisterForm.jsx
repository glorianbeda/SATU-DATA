import React, { useState } from 'react';
import { Box, TextField, Button, Alert, CircularProgress, Typography } from '@mui/material';
import { authApi } from '../constants/api';
import { useTranslation } from 'react-i18next';
import { Person, Email, Lock } from '@mui/icons-material';

const RegisterForm = ({ onSwitch }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('profile.password_mismatch') || 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(response.message || 'Registration successful! Please login.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.15)',
      },
      '&:hover fieldset': {
        borderColor: '#2563EB',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
        borderWidth: 2,
      },
    },
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Name Field */}
      <TextField
        margin="normal"
        fullWidth
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <Box component="span" sx={{ mr: 1, display: 'flex' }}>
              <Person className="text-gray-400" />
            </Box>
          ),
        }}
        sx={textFieldSx}
      />
      
      {/* Email Field */}
      <TextField
        margin="normal"
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <Box component="span" sx={{ mr: 1, display: 'flex' }}>
              <Email className="text-gray-400" />
            </Box>
          ),
        }}
        sx={textFieldSx}
      />
      
      {/* Password Field */}
      <TextField
        margin="normal"
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <Box component="span" sx={{ mr: 1, display: 'flex' }}>
              <Lock className="text-gray-400" />
            </Box>
          ),
        }}
        sx={textFieldSx}
      />
      
      {/* Confirm Password Field */}
      <TextField
        margin="normal"
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <Box component="span" sx={{ mr: 1, display: 'flex' }}>
              <Lock className="text-gray-400" />
            </Box>
          ),
        }}
        sx={textFieldSx}
      />

      {/* Error/Success Alerts */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {/* Submit Button - Gradient */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ 
          mt: 3, 
          mb: 2, 
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1D4ED8 0%, #1E3A8A 100%)',
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
          },
          '&:disabled': {
            background: '#e0e0e0',
            color: '#9e9e9e',
          }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : (t('register') || 'Register')}
      </Button>

      {/* Login Link */}
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
        {t('already_have_account')}{' '}
        <Box 
          component="span" 
          onClick={onSwitch} 
          sx={{ 
            color: '#2563EB', 
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          {t('login')}
        </Box>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
