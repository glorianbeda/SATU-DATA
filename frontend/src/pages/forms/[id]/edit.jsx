import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, TextField, FormControlLabel, Switch, CircularProgress, Fab } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAlert } from '~/context/AlertContext';
import FormBuilder from '~/features/dynamic-forms/components/FormBuilder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlert();
  const [loading, setLoading] = useState(true);
  
  const [schema, setSchema] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [settings, setSettings] = useState({
    limitOneResponse: false,
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/forms/${id}`, {
          withCredentials: true
        });
        const form = response.data;
        setTitle(form.title);
        setDescription(form.description || '');
        setSlug(form.slug);
        setSchema(form.schema || []);
        setIsActive(form.isActive);
        setSettings(form.settings || { limitOneResponse: false });
      } catch (error) {
        showError('Failed to load form');
        navigate('/forms');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      if (!title || !slug) {
        showError(t('forms.title_required'));
        return;
      }
      if (schema.length === 0) {
        showError(t('forms.add_field_required'));
        return;
      }

      const payload = {
        title,
        description,
        slug,
        schema,
        isActive,
        settings,
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/api/forms/${id}`, payload, {
        withCredentials: true
      });

      showSuccess(t('forms.form_updated'));
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.error || 'Failed to update form');
    }
  };

  if (loading) return <Box className="p-8 text-center"><CircularProgress /></Box>;

  return (
    <Box className="min-h-screen bg-gray-50 pb-24">
       {/* Header - Normal flow, scrolls with content */}
       <Box 
         sx={{ 
           bgcolor: 'white', 
           borderBottom: '1px solid #e5e7eb',
           boxShadow: 1,
           px: 2,
           py: 1.5
         }}
       >
         <Box className="flex items-center gap-3">
           <Button 
             startIcon={<ArrowBackIcon />} 
             onClick={() => navigate('/forms')} 
             size="small"
             className="shrink-0"
           >
             {t('forms.back')}
           </Button>
           <Typography variant="h6" className="truncate font-bold text-gray-800">
             {t('forms.edit_form')}
           </Typography>
         </Box>
       </Box>

       {/* Main Content */}
       <Box className="p-4 md:p-6">
          <Paper className="p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField 
                label={t('forms.title')} 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                fullWidth 
                size="small"
                className="md:col-span-2"
              />
              <TextField 
                label={t('forms.slug')} 
                value={slug} 
                fullWidth 
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                helperText={`Public URL: ${window.location.origin}/f/${slug}`}
                className="md:col-span-2"
              />
              <TextField 
                label={t('forms.description')} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                fullWidth 
                multiline
                rows={2}
                className="md:col-span-2"
              />
               <Box className="md:col-span-2 flex gap-4 flex-wrap">
                <FormControlLabel
                  control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                  label={t('forms.active')}
                />
                <FormControlLabel
                  control={<Switch checked={settings.limitOneResponse} onChange={(e) => setSettings({...settings, limitOneResponse: e.target.checked})} />}
                  label="Limit to 1 response"
                />
              </Box>
           </Paper>

           <FormBuilder schema={schema} onChange={setSchema} />
       </Box>

       {/* Save FAB - Bottom Right (All Screens) */}
       <Fab
         color="primary"
         aria-label="save"
         onClick={handleSave}
         className="!fixed bottom-6 right-6 z-[9999]"
         sx={{
           bgcolor: '#2563eb',
           '&:hover': { bgcolor: '#1d4ed8' },
           boxShadow: 4
         }}
       >
         <SaveIcon />
       </Fab>
    </Box>
  );
};

export default EditFormPage;
