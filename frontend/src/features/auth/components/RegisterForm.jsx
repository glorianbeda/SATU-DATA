import React, { useState } from 'react';
import { Box, TextField, Button, Alert, CircularProgress, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(response.data.message);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <Typography component="h1" variant="h4" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
        Create Account
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Join Satu Data+ organization
      </Typography>

      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <span 
                onClick={onSwitch} 
                className="text-blue-600 hover:underline cursor-pointer"
                style={{ cursor: 'pointer', color: '#1976d2' }}
              >
                Login here
              </span>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RegisterForm;
