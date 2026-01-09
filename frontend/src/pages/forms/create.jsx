import React, { useState } from 'react';
import { Box, Button, Typography, Paper, TextField, FormControlLabel, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAlert } from '~/context/AlertContext';
import FormBuilder from '~/features/dynamic-forms/components/FormBuilder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateFormPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlert();
  const [schema, setSchema] = useState([]);
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [settings, setSettings] = useState({
    limitOneResponse: false,
  });

  const handleSave = async () => {
    try {
      if (!title) {
        showError(t('forms.title_required'));
        return;
      }
      if (schema.length === 0) {
        showError(t('forms.add_field_required'));
        return;
      }

      // Auto-generate slug if (obviously) not present since we hide it
      const generatedSlug = slug || Math.random().toString(36).substring(2, 10);

      const payload = {
        title,
        description,
        slug: generatedSlug,
        schema,
        settings,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/forms`, payload, {
        withCredentials: true
      });

      showSuccess(t('forms.form_created'));
      navigate('/forms');
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.error || 'Failed to create form'); 
    }
  };

  return (
    <Box className="p-4 md:p-6 h-screen flex flex-col">
       <Box className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <Box className="flex items-center gap-2">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/forms')}>{t('forms.back')}</Button>
            <Typography variant="h5" className="truncate">{t('forms.create_form')}</Typography>
         </Box>
         <Button variant="contained" onClick={handleSave} fullWidth={false} className="w-full md:w-auto">{t('forms.save')}</Button>
       </Box>

       <Paper className="p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField 
            label={t('forms.title')} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            fullWidth 
            size="small"
            className="md:col-span-2"
          />
          {/* Slug Input is hidden for auto-generation */}
          
          <TextField 
            label={t('forms.description')} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            fullWidth 
            multiline
            rows={2}
            className="md:col-span-2"
          />
          <Box className="md:col-span-2 flex gap-4">
            <FormControlLabel
              control={<Switch checked={settings.limitOneResponse} onChange={(e) => setSettings({...settings, limitOneResponse: e.target.checked})} />}
              label="Limit to 1 response"
            />
          </Box>
       </Paper>

       <FormBuilder schema={schema} onChange={setSchema} />
    </Box>
  );
};

export default CreateFormPage;
