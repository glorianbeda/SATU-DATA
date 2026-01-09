import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ResponseTable from '~/features/dynamic-forms/components/ResponseTable';

const FormResponsesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formRes, responsesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/forms/${id}`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/forms/${id}/responses`, { withCredentials: true })
        ]);
        setForm(formRes.data);
        setResponses(responsesRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Box className="p-8 text-center"><CircularProgress /></Box>;

  return (
    <Box className="p-6">
      <Box className="mb-6 flex items-center gap-2">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/forms')}>Back</Button>
        <Box>
           <Typography variant="h5">{form?.title} - Responses</Typography>
           <Typography variant="body2" color="textSecondary">{responses.length} total responses</Typography>
        </Box>
      </Box>
      <ResponseTable form={form} responses={responses} loading={loading} />
    </Box>
  );
};

export default FormResponsesPage;
