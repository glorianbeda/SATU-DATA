import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { authApi } from '../constants/api';

const LoginForm = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { t } = useTranslation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authApi.login(email, password);

            // Cookie is set by server
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Check for redirect parameter
            const redirectUrl = searchParams.get('redirect');
            navigate(redirectUrl || '/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || t('login_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Email Field */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('email_label') || 'Email'}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                disabled={loading}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Email className="text-gray-400" />
                        </InputAdornment>
                    ),
                }}
                sx={{
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
                }}
            />
            
            {/* Password Field */}
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('password_label') || 'Password'}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                disabled={loading}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Lock className="text-gray-400" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                className="text-gray-400 hover:text-blue-600"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
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
                }}
            />

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {error}
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
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    t('sign_in')
                )}
            </Button>

            {/* Register Link */}
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                {t('dont_have_account')}{' '}
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
                    {t('register')}
                </Box>
            </Typography>
        </Box>
    );
};

export default LoginForm;
