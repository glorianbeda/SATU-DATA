import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import AppLayout from '~/components/AppLayout';
import DocumentUpload from '~/features/omk-docs/components/DocumentUpload';
import SignaturePlacer from '~/features/omk-docs/components/SignaturePlacer';
import Inbox from '~/features/omk-docs/components/Inbox';
import SigningInterface from '~/features/omk-docs/components/SigningInterface';
import ValidateDocument from '~/features/omk-docs/components/ValidateDocument';

const DocsPage = () => {
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [signingRequest, setSigningRequest] = useState(null);

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
    <AppLayout title="OMK Docs">
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
    </AppLayout>
  );
};

export default DocsPage;
