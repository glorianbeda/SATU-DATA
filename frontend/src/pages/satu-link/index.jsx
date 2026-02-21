import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, Tabs, Tab
} from '@mui/material';
import { useLayout } from '~/context/LayoutContext';
import { useTheme } from '~/context/ThemeContext';
import ShortLinksPage from './short-links';
import LinkTreePage from './link-tree';

const SatuLinkPage = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();
  const { mode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = mode === 'dark';

  useEffect(() => {
    setTitle(t('satu_link.title'));
  }, [t, setTitle]);

  const currentTab = location.pathname.includes('link-tree') ? 1 : 0;

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate('/satu-link/short-links');
    } else {
      navigate('/satu-link/link-tree');
    }
  };

  return (
    <Box className="p-2">
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        className="mb-4"
        sx={{
          '& .MuiTab-root': {
            color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
          },
          '& .Mui-selected': {
            color: isDark ? 'rgb(96, 165, 250)' : 'primary.main',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: isDark ? 'rgb(96, 165, 250)' : 'primary.main',
          },
        }}
      >
        <Tab label={t('satu_link.short_links')} />
        <Tab label={t('satu_link.link_tree')} />
      </Tabs>

      {currentTab === 0 ? <ShortLinksPage /> : <LinkTreePage />}
    </Box>
  );
};

export default SatuLinkPage;
