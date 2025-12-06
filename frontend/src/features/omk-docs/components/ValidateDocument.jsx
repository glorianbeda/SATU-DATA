import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert, Paper, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ValidateDocument = () => {
  const [checksum, setChecksum] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleValidate = async () => {
    if (!checksum) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/validate/${checksum}`);
      setResult(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setResult({ valid: false });
      } else {
        setError('Validation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-2xl mx-auto">
      <Paper className="p-6 mb-6">
        <Typography variant="h6" className="mb-4">Validate Document</Typography>
        <Box className="flex gap-4">
          <TextField 
            fullWidth 
            label="Document Checksum" 
            variant="outlined" 
            value={checksum}
            onChange={(e) => setChecksum(e.target.value)}
            placeholder="Enter SHA-256 checksum"
          />
          <Button 
            variant="contained" 
            onClick={handleValidate}
            disabled={loading || !checksum}
          >
            {loading ? <CircularProgress size={24} /> : 'Check'}
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      {result && (
        <Paper className={`p-6 border-l-4 ${result.valid ? 'border-green-500' : 'border-red-500'}`}>
          <Box className="flex items-center gap-3 mb-4">
            {result.valid ? (
              <CheckCircleIcon className="text-green-500 text-4xl" />
            ) : (
              <CancelIcon className="text-red-500 text-4xl" />
            )}
            <Typography variant="h5">
              {result.valid ? 'Document is Authentic' : 'Document Not Found'}
            </Typography>
          </Box>

          {result.valid && result.document && (
            <Box className="space-y-2">
              <Typography><strong>Title:</strong> {result.document.title}</Typography>
              <Typography><strong>Uploaded By:</strong> {result.document.uploadedBy.name}</Typography>
              <Typography><strong>Uploaded At:</strong> {new Date(result.document.uploadedAt).toLocaleString()}</Typography>
              
              <Typography className="mt-4 font-bold">Signatures:</Typography>
              {result.document.signatures.filter(s => s.isSigned || s.status === 'SIGNED').length > 0 ? (
                <ul className="list-disc pl-5">
                  {result.document.signatures.filter(s => s.isSigned || s.status === 'SIGNED').map((sig, index) => (
                    <li key={index}>
                      Signed by <strong>{sig.signer.name}</strong> on {new Date(sig.signedAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography className="text-gray-500 italic">No signatures yet.</Typography>
              )}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ValidateDocument;
