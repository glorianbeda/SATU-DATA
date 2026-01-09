import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, Typography, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
// Assuming useAlert is available in context (based on previous file content)
// If not found, I might need to adjust, but previous file had it.
// Checking imports again... yes: import { useAlert } from '~/context/AlertContext';
import { useAlert } from '~/context/AlertContext';
import ImportFormDialog from './ImportFormDialog';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const FormsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlert();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    fetchForms();
    checkEnv();
  }, []);

  const checkEnv = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/config`);
      setIsDev(response.data.isDev);
    } catch (error) {
       // Silent fail, default false
       console.log('Failed to check env');
    }
  };

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/forms`, {
        withCredentials: true
      });
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportSuccess = () => {
    showSuccess('Form imported successfully');
    fetchForms();
  };

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url);
    showSuccess('Link copied to clipboard');
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('forms.delete_confirm'))) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/forms/${id}`, {
        withCredentials: true
      });
      showSuccess('Form deleted');
      fetchForms();
    } catch (error) {
      showError('Failed to delete form');
    }
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Typography variant="h4">{t('forms.my_forms')}</Typography>
        <Box className="flex gap-2">
           {/* Dev Only Import Button */}
           {isDev && (
             <Button
               variant="outlined"
               startIcon={<FileUploadIcon />}
               onClick={() => setImportDialogOpen(true)}
               color="warning"
             >
               Import (Dev)
             </Button>
           )}
           <Button
             variant="contained"
             startIcon={<AddIcon />}
             onClick={() => navigate('/forms/create')}
           >
             {t('forms.create_form')}
           </Button>
        </Box>
      </Box>

      <ImportFormDialog 
        open={importDialogOpen} 
        onClose={() => setImportDialogOpen(false)} 
        onSuccess={handleImportSuccess} 
      />

      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} md={4} key={form.id}>
            <Paper className="p-4 flex flex-col gap-2 relative">
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography variant="h6">{form.title}</Typography>
                  <Typography variant="body2" className="text-gray-500 mb-2">
                    {form.description || t('forms.no_description')}
                  </Typography>
                  <Typography variant="caption" display="block">
                     {t('forms.responses_count', { count: form._count?.responses || 0 })}
                  </Typography>
                   <Chip 
                    label={form.isActive ? t('forms.active') : t('forms.inactive')} 
                    size="small" 
                    color={form.isActive ? 'success' : 'default'} 
                    className="mt-1"
                  />
                </Box>
              </Box>
              
              <Box className="flex justify-end gap-1 mt-4">
                 <IconButton size="small" onClick={() => handleCopyLink(form.slug)} title={t('forms.copy_link')}>
                  <ContentCopyIcon />
                </IconButton>
                 <IconButton size="small" onClick={() => window.open(`/f/${form.slug}`, '_blank')} title={t('forms.view_public')}>
                  <OpenInNewIcon />
                </IconButton>
                <IconButton size="small" onClick={() => navigate(`/forms/${form.id}/responses`)} title={t('forms.view_responses')}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton size="small" onClick={() => navigate(`/forms/${form.id}/edit`)} title={t('forms.edit_form')}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(form.id)} color="error" title={t('common.delete')}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FormsList;
