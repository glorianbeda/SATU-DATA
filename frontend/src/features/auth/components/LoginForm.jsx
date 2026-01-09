import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Grid,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LOGIN_API } from '../constants/api';

const LoginForm = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const { t } = useTranslation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}${LOGIN_API}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Cookie is set by server
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Check for redirect parameter
                const redirectUrl = searchParams.get('redirect');
                window.location.href = redirectUrl || '/dashboard';
            } else {
                setError(data.error || t('login_failed'));
            }
        } catch (err) {
            setError(t('network_error'));
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
                {t('welcome')}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                {t('subtitle')}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleLogin}
                noValidate
                sx={{
                    mt: 1,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t('email_label')}
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error}
                    disabled={loading}
                    InputProps={{
                        className: "dark:text-white"
                    }}
                    InputLabelProps={{
                        className: "dark:text-gray-400"
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0.87)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1976d2',
                            },
                            '&.dark .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                            },
                        },
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t('password_label')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error}
                    disabled={loading}
                    InputProps={{
                        className: "dark:text-white",
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    className="dark:text-gray-400"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        className: "dark:text-gray-400"
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t('sign_in')}
                </Button>
                <Grid container>
                    <Grid item xs>
                        {/* Forgot password link could go here */}
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" color="textSecondary">
                            Don't have an account?{' '}
                            <span 
                                onClick={onSwitch} 
                                className="text-blue-600 hover:underline cursor-pointer"
                                style={{ cursor: 'pointer', color: '#1976d2' }}
                            >
                                Register here
                            </span>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default LoginForm;
