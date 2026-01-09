import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ImportFormDialog = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setError(null);
    setLoading(true);

    try {
      // Validate JSON syntax locally first
      let parsedData;
      try {
        parsedData = JSON.parse(jsonContent);
      } catch (e) {
        throw new Error('Invalid JSON syntax');
      }

      // Send to API
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forms/import`, parsedData, {
        withCredentials: true
      });

      onSuccess();
      onClose();
      setJsonContent('');
    } catch (err) {
      console.error('Import failed', err);
      setError(err.response?.data?.error || err.message || 'Failed to import form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Form (Dev Only)</DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="mb-4 text-gray-500">
          Paste the form JSON schema below. This feature is only available in development environment.
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          id="json-content"
          label="Form JSON"
          type="text"
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          placeholder='{"title": "My Form", "schema": [...] }'
          disabled={loading}
          InputProps={{
             style: { fontFamily: 'monospace', fontSize: '13px' }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleImport} variant="contained" disabled={loading || !jsonContent.trim()}>
          {loading ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportFormDialog;
