import React, { useState, useEffect, useRef } from 'react';
// Force rebuild
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import axios from 'axios';
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const SignaturePlacer = ({ documentId, fileUrl, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [boxPosition, setBoxPosition] = useState({ x: 100, y: 100 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch users for dropdown
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        // Assuming we have an endpoint to list users. If not, we might need one.
        // For now, let's assume /api/users exists or use a mock/search.
        // Since I didn't create /api/users, I'll assume we can search or just list all.
        // I'll create a quick endpoint or just assume it exists for now (Task 2.3 in backend refactor mentioned updating services, but didn't explicitly add list users).
        // I'll assume /api/users is available or I'll add it later.
        // For now, I'll just put a placeholder or try to fetch.
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    // fetchUsers(); // Commented out until endpoint exists
    // Mock users for now
    setUsers([
        { id: 1, name: 'Super Admin', email: 'superadmin@satudata.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' }
    ]);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDragStop = (e, data) => {
    setBoxPosition({ x: data.x, y: data.y });
  };

  const handlePageLoadSuccess = (page) => {
    setPdfDimensions({ width: page.width, height: page.height });
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
        setMessage({ type: 'error', text: 'Please select a signer' });
        return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Normalize coordinates (0-1)
      // Note: Draggable position is relative to the container (Page).
      // We need to ensure the container size matches the PDF page size rendered.
      // react-pdf Page renders canvas.
      
      const normalizedX = boxPosition.x / pdfDimensions.width;
      const normalizedY = boxPosition.y / pdfDimensions.height;

      await axios.post(`${import.meta.env.VITE_API_URL}/api/documents/request-sign`, {
        documentId,
        signerId: selectedUser,
        x: normalizedX,
        y: normalizedY,
        page: pageNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Request sent successfully!' });
      setTimeout(() => onClose && onClose(), 2000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to send request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex flex-col gap-4 h-full">
      <Box className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
        <Box className="flex gap-4 items-center">
            <Button disabled={pageNumber <= 1} onClick={() => setPageNumber(prev => prev - 1)}>Prev</Button>
            <Typography>Page {pageNumber} of {numPages}</Typography>
            <Button disabled={pageNumber >= numPages} onClick={() => setPageNumber(prev => prev + 1)}>Next</Button>
        </Box>
        
        <Box className="flex gap-4 items-center">
            <FormControl size="small" className="w-48">
                <InputLabel>Signer</InputLabel>
                <Select
                    value={selectedUser}
                    label="Signer"
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    {users.map(user => (
                        <MenuItem key={user.id} value={user.id}>{user.name} ({user.email})</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Send Request'}
            </Button>
        </Box>
      </Box>

      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <Box className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center relative">
        <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="shadow-lg"
        >
            <Box className="relative" ref={containerRef}>
                <Page 
                    pageNumber={pageNumber} 
                    onLoadSuccess={handlePageLoadSuccess}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
                
                {/* Draggable Box */}
                <DraggableBox 
                    onStop={handleDragStop}
                />
            </Box>
        </Document>
      </Box>
    </Box>
  );
};

// Separate component to handle ref
const DraggableBox = ({ onStop }) => {
    const nodeRef = useRef(null);
    return (
        <Draggable
            bounds="parent"
            defaultPosition={{x: 100, y: 100}}
            onStop={onStop}
            nodeRef={nodeRef}
        >
            <div 
                ref={nodeRef}
                className="absolute w-32 h-16 border-2 border-blue-500 bg-blue-500/20 cursor-move flex items-center justify-center z-10 group"
                style={{ top: 0, left: 0 }} // Initial position handled by Draggable
            >
                <div className="absolute -top-8 left-0 w-full bg-black/75 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-center">
                    Drag to signature location
                </div>
                <Typography variant="caption" className="font-bold text-blue-800">
                    Sign Here
                </Typography>
            </div>
        </Draggable>
    );
};


export default SignaturePlacer;
