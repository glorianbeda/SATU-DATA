import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import DocumentUpload from '~/features/omk-docs/components/DocumentUpload';
import SignaturePlacer from '~/features/omk-docs/components/SignaturePlacer';
import Inbox from '~/features/omk-docs/components/Inbox';
import SigningInterface from '~/features/omk-docs/components/SigningInterface';
import ValidateDocument from '~/features/omk-docs/components/ValidateDocument';

const DocsPage = () => {
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [signingRequest, setSigningRequest] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUploadSuccess = (doc) => {
    setUploadedDoc(doc);
  };

  const handleSignClick = (request) => {
    setSigningRequest(request);
  };

  const handleCloseSigning = () => {
    setSigningRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <main className={`transition-all duration-300 p-8 ${isSidebarOpen ? 'ml-0' : 'ml-0'} lg:ml-64`}>
        <div className="flex items-center gap-4 mb-6">
            <IconButton 
                onClick={toggleSidebar} 
                className="lg:hidden text-gray-800 dark:text-white"
                edge="start"
            >
                <MenuIcon />
            </IconButton>
            <div className="flex-1">
                <Header title="OMK Docs" />
            </div>
        </div>

        {signingRequest ? (
            <SigningInterface request={signingRequest} onClose={handleCloseSigning} />
        ) : (
            <Routes>
            <Route path="/" element={<Navigate to="inbox" replace />} />
            
            <Route path="request" element={
                <Box className="h-[calc(100vh-200px)]">
                {!uploadedDoc ? (
                    <DocumentUpload onUploadSuccess={handleUploadSuccess} />
                ) : (
                    <SignaturePlacer 
                        documentId={uploadedDoc.id} 
                        fileUrl={`${import.meta.env.VITE_API_URL}${uploadedDoc.filePath}`}
                        onClose={() => setUploadedDoc(null)}
                    />
                )}
                </Box>
            } />
            
            <Route path="inbox" element={<Inbox onSignClick={handleSignClick} />} />
            
            <Route path="validate" element={<ValidateDocument />} />
            </Routes>
        )}
      </main>
    </div>
  );
};

export default DocsPage;
