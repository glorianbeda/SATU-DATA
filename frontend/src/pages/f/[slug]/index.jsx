import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, TextField, Container, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FormRenderer from '~/features/dynamic-forms/components/FormRenderer';

import PublicFormLayout from '~/features/dynamic-forms/components/PublicFormLayout';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PublicFormPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [user, setUser] = useState(null);

  // Check user session based on cookie/me endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
         // Assuming we have a context or we can try fetching profile
         // If generic axios with credentials works:
         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, { withCredentials: true });
         setUser(response.data.user || response.data);
      } catch (err) {
         // Not logged in
         console.log('User not logged in');
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/forms/public/${slug}`);
        setForm(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Form not found or inactive');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [slug]);

  const handleSubmit = async (data) => {
    // Client-side limit check
    if (form?.settings?.limitOneResponse) {
       if (localStorage.getItem(`submitted_${form.id}`)) {
          setError('You have already submitted this form.');
          return;
       }
    }

    if (!user && !guestName.trim()) {
       setError('Please enter your name.');
       return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forms/${slug}/submit`, {
        data,
        guestName: user ? undefined : guestName
      }, {
        withCredentials: true 
      });
      setSuccess(true);
      
      // Mark as submitted
      if (form?.settings?.limitOneResponse) {
        localStorage.setItem(`submitted_${form.id}`, 'true');
      }
    } catch (error) {
      if (error.response?.data?.error) {
         setError(error.response.data.error);
      } else {
         setError('Submission failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <PublicFormLayout>
        <Box className="p-8 text-center"><CircularProgress /></Box>
    </PublicFormLayout>
  );

  if (success) return (
    <PublicFormLayout>
        <Paper className="p-8 text-center max-w-lg mx-auto">
          <Typography variant="h4" color="primary" gutterBottom>Terima Kasih!</Typography>
          <Typography>Respons Anda telah berhasil dikirim.</Typography>
          <Button variant="outlined" className="mt-4" onClick={() => window.location.reload()}>
             Kirim Respons Lagi
          </Button>
        </Paper>
    </PublicFormLayout>
  );

  if (!form || error) return (
    <PublicFormLayout>
       <Alert severity="error">{error || 'Formulir tidak tersedia'}</Alert>
    </PublicFormLayout>
  );

  // Check if current user is the creator (simple check, assuming we have creator ID or just show Edit if logged in?)
  // Ideally form returns `isCreator` or we compare IDs. 
  // form.createdById vs user.id
  const canEdit = user && form.createdById === user.id;

  return (
    <PublicFormLayout>
      <Paper className="p-6 md:p-8 relative">
        <Typography variant="h4" className="mb-2 font-bold">{form.title}</Typography>
        <Typography variant="body1" className="text-gray-600 mb-6 whitespace-pre-line">{form.description}</Typography>
        
        <Box className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
           {user ? (
             <Box className="flex items-center gap-3">
                <Box className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                   {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </Box>
                <Box>
                   <Typography variant="body2" className="font-bold text-gray-800">
                      Mengisi sebagai {user.name || user.email || 'User'}
                   </Typography>
                   <Typography variant="caption" className="text-gray-500">
                      {user.email}
                   </Typography>
                </Box>
             </Box>
           ) : (
             <Box>
                <Box className="flex items-center justify-between mb-3">
                   <Typography variant="subtitle2" className="font-bold text-gray-700">Mengisi sebagai Tamu</Typography>
                   <Button 
                     variant="outlined" 
                     size="small" 
                     onClick={() => navigate(`/login?redirect=/f/${slug}`)}
                   >
                     Login
                   </Button>
                </Box>
                <TextField 
                  fullWidth 
                  placeholder="Masukkan nama lengkap Anda..."
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)}
                  size="small"
                  variant="outlined"
                  required
                  error={!!error && !guestName}
                  helperText={!guestName && error ? "Nama wajib diisi" : ""}
                />
             </Box>
           )}
        </Box>

        <FormRenderer schema={form.schema} onSubmit={handleSubmit} />
        
        {submitting && <CircularProgress size={24} className="mt-4" />}
      </Paper>

      {/* Floating Edit Button for Creator */}
      {canEdit && (
         <Fab 
           color="primary" 
           aria-label="edit" 
           className="fixed bottom-24 right-6 shadow-lg z-50"
           onClick={() => navigate(`/forms/${form.id}/edit`)}
         >
           <EditIcon />
         </Fab>
      )}
    </PublicFormLayout>
  );
};

export default PublicFormPage;
