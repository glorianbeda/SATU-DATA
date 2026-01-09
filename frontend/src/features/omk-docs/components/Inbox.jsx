import React, { useState, useEffect, useMemo } from 'react';
import api from '~/utils/api';
import { Chip, Button, CircularProgress, Box, Tabs, Tab } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import { DataTable } from '~/components/DataTable';

const Inbox = ({ onSignClick }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 = Pending, 1 = Signed by me

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const profileRes = await api.get('/api/profile');
        setCurrentUser(profileRes.data.user);

        const response = await api.get('/api/documents/requests');
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
    // Check if document is deleted by admin
    if (req.document?.deletedAt) {
      return <Chip icon={<CancelIcon />} label="File Dihapus" color="error" size="small" />;
    }
    if (req.isSigned) {
      return <Chip icon={<CheckCircleIcon />} label="Signed" color="success" size="small" sx={{ color: 'white' }} />;
    }
    switch (req.status) {
      case 'SIGNED':
        return <Chip icon={<CheckCircleIcon />} label="Signed" color="success" size="small" sx={{ color: 'white' }} />;
      case 'REJECTED':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
      default:
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
    }
  };

  // Transform and filter data for DataTable based on active tab
  const tableData = useMemo(() => {
    const allData = requests.map(req => ({
      id: req.id,
      documentTitle: req.document?.deletedAt ? 'File telah dihapus admin' : (req.document?.title || '-'),
      requester: req.document?.uploader?.name || '-',
      signer: req.signer?.name || '-',
      status: req.status,
      isSigned: req.isSigned,
      isDeleted: !!req.document?.deletedAt,
      createdAt: req.createdAt,
      signedAt: req.signedAt,
      signerId: req.signerId,
      document: req.document,
      _original: req,
    }));

    if (!currentUser) return allData;

    if (activeTab === 0) {
      // Pending: requests where I am the signer and status is PENDING
      return allData.filter(req => req.signerId === currentUser.id && req.status === 'PENDING');
    } else {
      // Signed by me: requests where I am the signer and status is SIGNED
      return allData.filter(req => req.signerId === currentUser.id && req.status === 'SIGNED');
    }
  }, [requests, currentUser, activeTab]);

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
      headerName: activeTab === 0 ? 'Tanggal Permintaan' : 'Tanggal Ditandatangani',
      width: 150,
      renderCell: (row) => {
        const date = activeTab === 0 ? row.createdAt : (row.signedAt || row.createdAt);
        return new Date(date).toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      },
      valueGetter: (row) => {
        const date = activeTab === 0 ? row.createdAt : (row.signedAt || row.createdAt);
        return new Date(date).toLocaleDateString();
      },
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 200,
      sortable: false,
      exportable: false,
      renderCell: (row) => (
        <Box className="flex gap-1">
          {row.isDeleted ? (
            <Chip label="Tidak tersedia" size="small" color="default" />
          ) : (
            <>
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
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab 
          icon={<PendingIcon />} 
          iconPosition="start" 
          label="Menunggu Tanda Tangan" 
        />
        <Tab 
          icon={<HistoryIcon />} 
          iconPosition="start" 
          label="Sudah Ditandatangani" 
        />
      </Tabs>
      <DataTable
        columns={columns}
        data={tableData}
        loading={loading}
        title={activeTab === 0 ? "Permintaan Menunggu" : "Dokumen Sudah Ditandatangani"}
        emptyMessage={activeTab === 0 ? "Tidak ada permintaan menunggu" : "Belum ada dokumen yang ditandatangani"}
        exportable={true}
        searchable={true}
        pagination={true}
        defaultRowsPerPage={10}
      />
    </Box>
  );
};

export default Inbox;
