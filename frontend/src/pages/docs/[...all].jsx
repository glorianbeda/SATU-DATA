import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useLayout } from '~/context/LayoutContext';
import SignatureRequestWizard from '~/features/omk-docs/components/SignatureRequestWizard';
import Inbox from '~/features/omk-docs/components/Inbox';
import SigningInterface from '~/features/omk-docs/components/SigningInterface';
import ValidateDocument from '~/features/omk-docs/components/ValidateDocument';

const DocsPage = () => {
  const { setTitle } = useLayout();
  const navigate = useNavigate();
  const [signingRequest, setSigningRequest] = useState(null);

  React.useEffect(() => {
    setTitle('OMK Docs');
  }, [setTitle]);

  const handleSignClick = (request) => {
    setSigningRequest(request);
  };

  const handleCloseSigning = () => {
    setSigningRequest(null);
  };

  const handleWizardComplete = () => {
    navigate('/docs/inbox');
  };

  const handleWizardCancel = () => {
    navigate('/docs/inbox');
  };

  return (
    <>
      {signingRequest ? (
          <SigningInterface request={signingRequest} onClose={handleCloseSigning} />
      ) : (
          <Routes>
          <Route path="/" element={<Navigate to="inbox" replace />} />
          
          <Route path="request" element={
              <Box className="h-[calc(100vh-200px)]">
                <SignatureRequestWizard 
                  onComplete={handleWizardComplete}
                  onCancel={handleWizardCancel}
                />
              </Box>
          } />
          
          <Route path="inbox" element={<Inbox onSignClick={handleSignClick} />} />
          
          <Route path="validate" element={<ValidateDocument />} />
          </Routes>
      )}
    </>
  );
};

export default DocsPage;

