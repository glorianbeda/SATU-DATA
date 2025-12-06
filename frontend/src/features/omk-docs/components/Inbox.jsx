import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Chip, Button, Typography, Box, CircularProgress 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

const Inbox = ({ onSignClick }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        // Get current user to know if we are signer or requester
        // Assuming we have user info in local storage or context, but for now fetch profile or decode token
        // Let's just fetch profile quickly or rely on logic
        const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(profileRes.data.user);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data.requests);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusChip = (req) => {
    if (req.isSigned) {
        return <Chip icon={<CheckCircleIcon />} label="Signed" color="success" size="small" />;
    }
    switch (req.status) {
      case 'SIGNED':
        return <Chip icon={<CheckCircleIcon />} label="Signed" color="success" size="small" />;
      case 'REJECTED':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
      default:
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper} className="shadow-sm border border-gray-100 dark:border-gray-700">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Document</TableCell>
            <TableCell>Requester</TableCell>
            <TableCell>Signer</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell>{req.document.title}</TableCell>
              <TableCell>{req.document.uploader.name}</TableCell>
              <TableCell>{req.signer.name}</TableCell>
              <TableCell>{getStatusChip(req)}</TableCell>
              <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {req.status === 'PENDING' && currentUser && req.signerId === currentUser.id && (
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => onSignClick(req)}
                  >
                    Sign
                  </Button>
                )}
                {/* Add View/Download button for everyone */}
                <Button 
                    variant="outlined" 
                    size="small" 
                    href={`${import.meta.env.VITE_API_URL}${req.document.filePath}`}
                    target="_blank"
                    sx={{ ml: 1 }}
                >
                    Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">No requests found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Inbox;
