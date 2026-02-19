import React, { useState, useCallback } from 'react';
import { useTheme } from '~/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '~/i18n';
import {
  Search as SearchIcon,
  NotificationsNone as BellIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Language as LanguageIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { 
  Menu, 
  MenuItem, 
  IconButton, 
  Tooltip, 
  Avatar, 
  ListItemIcon, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '~/context/AlertContext';
import IndonesiaFlag from '~/assets/indonesia.png';
import USFlag from '~/assets/united-states.png';

const Header = ({ title, toggleSidebar, user }) => {
  const { mode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess } = useAlert();
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const today = new Date().toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleLanguageChange = useCallback((lang) => {
    changeLanguage(lang);
    setLangAnchorEl(null);
  }, []);

  const handleLogoutClick = useCallback(() => {
    setProfileAnchorEl(null);
    setLogoutDialogOpen(true);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
    setLogoutDialogOpen(false);
    
    // Call API to clear cookie
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout API failed', err);
    }
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    showSuccess(t('common.logout_success') || 'Logged out successfully');
    navigate('/login');
  }, [navigate, showSuccess, t]);

  const currentLang = i18n.language === 'id' ? IndonesiaFlag : USFlag;

  return (
    <div className="flex justify-between items-start md:items-center">
      <div className="flex items-start md:items-center gap-3 md:gap-4">
        <IconButton
          onClick={toggleSidebar}
          className="text-gray-500 dark:text-gray-400 mt-[-4px] md:mt-0"
        >
          <MenuIcon />
        </IconButton>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-64">
            <SearchIcon className="text-gray-400 mr-2" fontSize="small" />
            <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full text-gray-600 dark:text-gray-200 placeholder-gray-400"
            />
        </div>

        {/* Language Selector */}
        <Tooltip title={t('header.change_language') || 'Change Language'}>
          <button
            onClick={(e) => setLangAnchorEl(e.currentTarget)}
            className="hidden md:flex p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-blue-600 transition-colors items-center gap-1"
          >
            <img src={currentLang} alt="Flag" style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2 }} />
          </button>
        </Tooltip>
        <Menu
          anchorEl={langAnchorEl}
          open={Boolean(langAnchorEl)}
          onClose={() => setLangAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            onClick={() => handleLanguageChange('id')}
            selected={i18n.language === 'id'}
          >
            <img src={IndonesiaFlag} alt="Indonesia" style={{ width: 20, height: 14, marginRight: 8, objectFit: 'cover', borderRadius: 1 }} />
            Bahasa Indonesia
          </MenuItem>
          <MenuItem
            onClick={() => handleLanguageChange('en')}
            selected={i18n.language === 'en'}
          >
            <img src={USFlag} alt="English" style={{ width: 20, height: 14, marginRight: 8, objectFit: 'cover', borderRadius: 1 }} />
            English
          </MenuItem>
        </Menu>

        {/* Theme Toggle Switch */}
        <div
            onClick={toggleTheme}
            className="hidden md:block relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer transition-colors duration-300 shadow-sm border border-gray-100 dark:border-gray-600"
        >
            {/* Toggle Circle */}
            <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                    mode === 'dark' ? 'translate-x-8' : 'translate-x-0'
                }`}
            >
                {mode === 'dark' ? (
                    <DarkModeIcon sx={{ fontSize: 14, color: '#fbbf24' }} />
                ) : (
                    <LightModeIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                )}
            </div>

            {/* Background Icons */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
                <LightModeIcon sx={{ fontSize: 14, color: mode === 'light' ? 'transparent' : '#9ca3af' }} />
                <DarkModeIcon sx={{ fontSize: 14, color: mode === 'dark' ? 'transparent' : '#9ca3af' }} />
            </div>
        </div>

        {/* Notifications */}
        <button className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-blue-600 transition-colors relative">
            <BellIcon fontSize="small" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </button>

        {/* Profile Dropdown */}
        <Tooltip title={t('header.account_settings') || 'Account settings'}>
            <IconButton
                onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                size="small"
                sx={{ ml: 0.5 }}
                aria-controls={Boolean(profileAnchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(profileAnchorEl) ? 'true' : undefined}
            >
                {user?.profilePicture ? (
                    <Avatar
                        src={user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                        sx={{ width: 40, height: 40 }}
                    />
                ) : (
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                        {user?.name?.substring(0, 1).toUpperCase() || 'U'}
                    </Avatar>
                )}
            </IconButton>
        </Tooltip>
        <Menu
            anchorEl={profileAnchorEl}
            id="account-menu"
            open={Boolean(profileAnchorEl)}
            onClose={() => setProfileAnchorEl(null)}
            onClick={() => setProfileAnchorEl(null)}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
                className: "dark:bg-gray-800 dark:text-white"
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <div className="px-4 py-2">
                <p className="font-bold text-sm text-gray-800 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <Divider className="dark:border-gray-700" />
            <MenuItem onClick={() => navigate('/profile')}>
                <ListItemIcon>
                    <PersonIcon fontSize="small" className="dark:text-gray-400" />
                </ListItemIcon>
                Profile
            </MenuItem>

            {/* Mobile Only Menu Items */}
            <div className="md:hidden">
                <Divider className="dark:border-gray-700" />
                <MenuItem onClick={() => handleLanguageChange(i18n.language === 'id' ? 'en' : 'id')}>
                    <ListItemIcon>
                        <LanguageIcon fontSize="small" className="dark:text-gray-400" />
                    </ListItemIcon>
                    {i18n.language === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
                </MenuItem>
                <MenuItem onClick={toggleTheme}>
                    <ListItemIcon>
                        {mode === 'dark' ? <LightModeIcon fontSize="small" className="dark:text-gray-400" /> : <DarkModeIcon fontSize="small" className="dark:text-gray-400" />}
                    </ListItemIcon>
                    {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </MenuItem>
            </div>
            <MenuItem onClick={handleLogoutClick}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" className="dark:text-gray-400" />
                </ListItemIcon>
                {t('logout') || 'Logout'}
            </MenuItem>
        </Menu>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
          PaperProps={{
            className: "dark:bg-gray-800 dark:text-white"
          }}
        >
          <DialogTitle id="logout-dialog-title" className="dark:text-white">
            {t('common.logout_confirm_title') || 'Confirm Logout'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="logout-dialog-description" className="dark:text-gray-300">
              {t('common.logout_confirm_message') || 'Are you sure you want to logout from the application?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutDialogOpen(false)} className="dark:text-gray-300">
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button onClick={handleLogoutConfirm} color="error" variant="contained" autoFocus>
              {t('common.logout') || 'Logout'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default React.memo(Header);
