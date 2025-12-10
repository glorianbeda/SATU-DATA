import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Chip, Button, CircularProgress, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import DownloadIcon from '@mui/icons-material/Download';
import { DataTable } from '~/components/DataTable';

const Inbox = ({ onSignClick }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
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

  // Transform data for DataTable
  const tableData = useMemo(() => {
    return requests.map(req => ({
      id: req.id,
      documentTitle: req.document?.title || '-',
      requester: req.document?.uploader?.name || '-',
      signer: req.signer?.name || '-',
      status: req.status,
      isSigned: req.isSigned,
      createdAt: req.createdAt,
      signerId: req.signerId,
      document: req.document,
      _original: req,
    }));
  }, [requests]);

  const columns = [
    { field: 'documentTitle', headerName: 'Document', width: 200 },
    { field: 'requester', headerName: 'Requester', width: 150 },
    { field: 'signer', headerName: 'Signer', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      exportable: false,
      renderCell: (row) => getStatusChip(row._original),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 120,
      renderCell: (row) => new Date(row.createdAt).toLocaleDateString(),
      valueGetter: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 200,
      sortable: false,
      exportable: false,
      renderCell: (row) => (
        <Box className="flex gap-1">
          {row.status === 'PENDING' && currentUser && row.signerId === currentUser.id && (
            <Button
              variant="contained"
              size="small"
              onClick={() => onSignClick(row._original)}
            >
              Sign
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            href={`${import.meta.env.VITE_API_URL}${row.document?.filePath}`}
            target="_blank"
          >
            Download
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tableData}
      loading={loading}
      title="Document Requests"
      emptyMessage="No requests found"
      exportable={true}
      searchable={true}
      pagination={true}
      defaultRowsPerPage={10}
    />
  );
};

export default Inbox;
