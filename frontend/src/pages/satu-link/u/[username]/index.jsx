import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  CircularProgress, 
  Paper,
  useTheme
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkIcon from '@mui/icons-material/Link';
import LanguageIcon from '@mui/icons-material/Language';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from '~/utils/api';
import { useAlert } from '~/context/AlertContext';
import { SATU_LINK_API } from '~/features/satu-link/constants/api';

const iconMap = {
  'language': <LanguageIcon />,
  'whatsapp': <WhatsAppIcon />,
  'instagram': <InstagramIcon />,
  'facebook': <FacebookIcon />,
  'twitter': <TwitterIcon />,
  'youtube': <YouTubeIcon />,
  'email': <EmailIcon />,
  'phone': <PhoneIcon />,
  'location': <LocationOnIcon />,
  'link': <LinkIcon />,
};

const PublicLinkTreePage = () => {
  const { username } = useParams();
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlert();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [linkTree, setLinkTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinkTree = async () => {
      try {
        const response = await api.get(SATU_LINK_API.GET_PUBLIC_LINK_TREE(username));
        setLinkTree(response.data.linkTree);
      } catch (err) {
        setError(err.response?.data?.error || t('satu_link.link_tree_not_found', 'Link tree tidak ditemukan'));
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchLinkTree();
    }
  }, [username, t]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showSuccess(t('satu_link.link_copied_to_clipboard', 'Link disalin ke clipboard!'));
  };

  const getIconComponent = (iconName) => {
    if (!iconName) return <LinkIcon />;
    const lowerIcon = iconName.toLowerCase();
    if (iconMap[lowerIcon]) {
      return iconMap[lowerIcon];
    }
    return <LinkIcon />;
  };

  if (loading) {
    return (
      <Box 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4"
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4"
      >
        <Paper 
          className="p-8 w-full max-w-md rounded-2xl text-center"
          elevation={3}
        >
          <Typography variant="h5" fontWeight="600" color="error" gutterBottom>
            {t('common.error', 'Error')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.history.back()}
          >
            {t('satu_link.go_back', 'Kembali')}
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box 
      className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      sx={{ px: { xs: 3, sm: 4, md: 6 }, py: { xs: 4, sm: 6 } }}
    >
      <Box className="w-full max-w-2xl mx-auto flex flex-col justify-between" sx={{ minHeight: 'calc(100vh - 48px)' }}>
        <Box className="text-center mb-6">
          <Paper
            className="inline-block p-1"
            sx={{ 
              borderRadius: '50%',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Avatar 
              src={linkTree?.user?.profilePicture}
              sx={{ 
                width: 100, 
                height: 100, 
                margin: '4px',
                fontSize: '2.5rem',
                bgcolor: 'primary.main',
              }}
            >
              {linkTree?.user?.name?.charAt(0)}
            </Avatar>
          </Paper>
          
          <Typography 
            variant="h5" 
            fontWeight="700" 
            sx={{ 
              mt: 3,
              color: 'text.primary',
            }}
          >
            {linkTree?.title}
          </Typography>
          
          {linkTree?.bio && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                mt: 1,
              }}
            >
              {linkTree.bio}
            </Typography>
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyLink}
            sx={{ 
              mt: 3,
              borderRadius: '12px',
              px: 3,
            }}
          >
            {t('satu_link.copy_link', 'Salin Link')}
          </Button>
        </Box>

        <Box className="w-full space-y-3 px-2 sm:px-4" sx={{ flexGrow: 1 }}>
          {linkTree?.items?.map((item, index) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Paper 
                className="p-4 flex items-center gap-4 w-full"
                sx={{ 
                  borderRadius: '20px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  background: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.01)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    background: isDark ? 'rgba(50, 50, 50, 1)' : 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <Box 
                  className="flex items-center justify-center"
                  sx={{ 
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                    color: 'white',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  {getIconComponent(item.icon)}
                </Box>
                <Box className="flex-1 min-w-0">
                  <Typography 
                    variant="body1" 
                    fontWeight="600"
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.url}
                  </Typography>
                </Box>
                <OpenInNewIcon sx={{ color: 'primary.main' }} />
              </Paper>
            </a>
          ))}

          {(!linkTree?.items || linkTree.items.length === 0) && (
            <Paper 
              className="p-10 text-center"
              sx={{ 
                borderRadius: '24px',
                background: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <LinkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {t('satu_link.no_links_yet', 'Belum ada link')}
              </Typography>
            </Paper>
          )}
        </Box>

        <Box className="text-center mt-8">
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            © {new Date().getFullYear()} OMK HMTB Cicurug. All Rights Reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PublicLinkTreePage;
