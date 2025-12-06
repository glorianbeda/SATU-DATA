import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useConfirm } from '~/context/ConfirmationContext';

const SigningInterface = ({ request, onClose }) => {
  const { confirm } = useConfirm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [otherPendingRequests, setOtherPendingRequests] = useState([]);

  useEffect(() => {
    const fetchOtherRequests = async () => {
        if (!request || !request.documentId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter for same document, current user, pending, and NOT the current request
            const others = response.data.requests.filter(r => 
                r.documentId === request.documentId && 
                r.status === 'PENDING' && 
                r.id !== request.id
            );
            setOtherPendingRequests(others);
        } catch (err) {
            console.error("Failed to fetch other requests", err);
        }
    };
    fetchOtherRequests();
  }, [request]);

  const handleSign = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/documents/sign`, {
        requestId: request.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Document signed successfully!' });
      setTimeout(() => onClose && onClose(true), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to sign' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const allRequestIds = [request.id, ...otherPendingRequests.map(r => r.id)];
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/documents/sign-batch`, {
        documentId: request.documentId,
        requestIds: allRequestIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage({ type: 'success', text: 'All requests signed successfully!' });
      setTimeout(() => onClose && onClose(true), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to sign all' });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const isConfirmed = await confirm({
      title: 'Tolak Permintaan?',
      description: 'Apakah Anda yakin ingin menolak permintaan tanda tangan ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Tolak',
      cancelText: 'Batal',
      variant: 'danger'
    });

    if (!isConfirmed) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/documents/reject`, {
        requestId: request.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'info', text: 'Request rejected.' });
      setTimeout(() => onClose && onClose(true), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to reject' });
    } finally {
      setLoading(false);
    }
  };

  const handlePageLoadSuccess = (page) => {
    setPdfDimensions({ width: page.width, height: page.height });
  };

  // Calculate box position
  // request.x, request.y are normalized (0-1)
  const boxLeft = request.x * pdfDimensions.width;
  const boxTop = request.y * pdfDimensions.height;
  const boxWidth = request.width ? request.width * pdfDimensions.width : 100;
  const boxHeight = request.height ? request.height * pdfDimensions.height : 50;

  const fileUrl = `${import.meta.env.VITE_API_URL}${request.document.filePath}`;

  return (
    <Box className="flex flex-col gap-4 h-full">
      <Box className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
        <Typography variant="h6">Signing: {request.document.title}</Typography>
        <Box className="flex gap-2">
            <Button 
                variant="contained" 
                color="error" 
                startIcon={<CancelIcon />}
                onClick={handleReject}
                disabled={loading}
            >
                Reject
            </Button>
            <Button 
                variant="contained" 
                color="success" 
                startIcon={<CheckCircleIcon />}
                onClick={handleSign}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign'}
            </Button>
            {otherPendingRequests.length > 0 && (
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<CheckCircleIcon />}
                    onClick={handleSignAll}
                    disabled={loading}
                >
                    Agree & Sign All ({otherPendingRequests.length + 1})
                </Button>
            )}
        </Box>
      </Box>

      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <Box className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center relative">
        <Document file={fileUrl} className="shadow-lg">
            <Box className="relative">
                <Page 
                    pageNumber={request.page} 
                    onLoadSuccess={handlePageLoadSuccess}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
                
                {/* Signature Box Indicator */}
                {pdfDimensions.width > 0 && (
                    <Box 
                        className="absolute border-2 border-green-500 bg-green-500/20 flex items-center justify-center animate-pulse"
                        style={{ 
                            top: boxTop, 
                            left: boxLeft,
                            width: boxWidth,
                            height: boxHeight 
                        }}
                    >
                        <Typography variant="caption" className="font-bold text-green-800">
                            {request.type === 'text' ? (request.text || 'Text') : 
                             request.type === 'date' ? 'Date' : 
                             'Your Signature'}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Document>
      </Box>
    </Box>
  );
};

export default SigningInterface;
