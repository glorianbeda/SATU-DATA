import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Typography, 
  Alert,
  CircularProgress
} from '@mui/material';

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t('profile.password_mismatch') });
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');

      await axios.put(`${apiUrl}/api/profile/password`, {
        oldPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage({ type: 'success', text: t('profile.password_updated') });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Password update failed:", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || t('profile.password_update_failed') 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <Typography variant="h6" className="mb-6 text-gray-800 dark:text-white font-bold">
        {t('profile.change_password')}
      </Typography>

      {message && (
        <Alert severity={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label={t('profile.old_password')}
          type="password"
          variant="outlined"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="bg-gray-50 dark:bg-gray-900"
          InputLabelProps={{ className: "dark:text-gray-400" }}
          InputProps={{ className: "dark:text-white" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.87)" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
              ".dark &:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.87)" },
              ".dark &.Mui-focused fieldset": { borderColor: "#90caf9" },
              ".dark &": { color: "white" },
            },
            "& .MuiInputLabel-root": {
              ".dark &": { color: "rgba(255, 255, 255, 0.7)" },
              ".dark &.Mui-focused": { color: "#90caf9" },
            },
          }}
        />
        
        <TextField
          label={t('profile.new_password')}
          type="password"
          variant="outlined"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="bg-gray-50 dark:bg-gray-900"
          InputLabelProps={{ className: "dark:text-gray-400" }}
          InputProps={{ className: "dark:text-white" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.87)" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
              ".dark &:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.87)" },
              ".dark &.Mui-focused fieldset": { borderColor: "#90caf9" },
              ".dark &": { color: "white" },
            },
            "& .MuiInputLabel-root": {
              ".dark &": { color: "rgba(255, 255, 255, 0.7)" },
              ".dark &.Mui-focused": { color: "#90caf9" },
            },
          }}
        />

        <TextField
          label={t('profile.confirm_password')}
          type="password"
          variant="outlined"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-gray-50 dark:bg-gray-900"
          InputLabelProps={{ className: "dark:text-gray-400" }}
          InputProps={{ className: "dark:text-white" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
              "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.87)" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              ".dark & fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
              ".dark &:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.87)" },
              ".dark &.Mui-focused fieldset": { borderColor: "#90caf9" },
              ".dark &": { color: "white" },
            },
            "& .MuiInputLabel-root": {
              ".dark &": { color: "rgba(255, 255, 255, 0.7)" },
              ".dark &.Mui-focused": { color: "#90caf9" },
            },
          }}
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          size="large"
          disabled={loading}
          className="mt-2"
        >
          {loading ? <CircularProgress size={24} /> : t('profile.update_password')}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
