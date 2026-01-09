import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import DrawIcon from '@mui/icons-material/Draw';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import api from '~/utils/api';

// Step Components
import ModeSelectionStep from './wizard/ModeSelectionStep';
import DocumentUploadStep from './wizard/DocumentUploadStep';
import AnnotateStep from './wizard/AnnotateStep';
import ConfirmStep from './wizard/ConfirmStep';

const SignatureRequestWizard = ({ onComplete, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [draftFilePreviewUrl, setDraftFilePreviewUrl] = useState(null);
  const [wizardData, setWizardData] = useState({
    mode: null, // 'self' or 'request'
    draftFile: null, // File object stored locally until submit
    annotations: [],
    title: '',
    signers: []
  });

  // Create/cleanup preview URL when draftFile changes
  useEffect(() => {
    if (wizardData.draftFile) {
      const url = URL.createObjectURL(wizardData.draftFile);
      setDraftFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setDraftFilePreviewUrl(null);
    }
  }, [wizardData.draftFile]);

  // Cleanup on wizard cancel/unmount
  useEffect(() => {
    return () => {
      if (draftFilePreviewUrl) {
        URL.revokeObjectURL(draftFilePreviewUrl);
      }
    };
  }, []);

  // Fetch current user for self-sign mode
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/api/profile');
        setCurrentUser(response.data.user);
        console.log('User loaded:', response.data);
      } catch (err) {
        console.error('Failed to fetch current user', err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // Dynamic steps based on mode
  const getSteps = () => {
    if (!wizardData.mode) {
      return [{ label: 'Pilih Mode', icon: <TouchAppIcon /> }];
    }
    
    if (wizardData.mode === 'self') {
      return [
        { label: 'Pilih Mode', icon: <TouchAppIcon /> },
        { label: 'Upload', icon: <CloudUploadIcon /> },
        { label: 'Anotasi', icon: <EditIcon /> },
        { label: 'Konfirmasi', icon: <DrawIcon /> }
      ];
    }
    
    // Request mode
    return [
      { label: 'Pilih Mode', icon: <TouchAppIcon /> },
      { label: 'Upload', icon: <CloudUploadIcon /> },
      { label: 'Anotasi & Penanda Tangan', icon: <EditIcon /> },
      { label: 'Konfirmasi', icon: <SendIcon /> }
    ];
  };

  const steps = getSteps();

  const handleModeSelect = (mode) => {
    setWizardData(prev => ({ ...prev, mode }));
    setActiveStep(1);
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    if (activeStep === 1) {
      // Going back to mode selection, reset mode
      setWizardData(prev => ({ ...prev, mode: null }));
    }
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const updateWizardData = (key, value) => {
    setWizardData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (onComplete) {
      onComplete(wizardData);
    }
  };

  const canProceed = () => {
    if (activeStep === 0) return wizardData.mode !== null;
    
    const stepIndex = activeStep;
    switch (stepIndex) {
      case 1: 
        if (wizardData.mode === 'request') {
          return wizardData.draftFile !== null && wizardData.signers.length > 0;
        }
        return wizardData.draftFile !== null;
      case 2: return wizardData.annotations.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return <ModeSelectionStep onModeSelect={handleModeSelect} />;
    }

    switch (activeStep) {
      case 1:
        return (
          <DocumentUploadStep 
            draftFile={wizardData.draftFile}
            onDraftFileChange={(file) => updateWizardData('draftFile', file)}
            onTitleChange={(title) => updateWizardData('title', title)}
            mode={wizardData.mode}
            selectedSigners={wizardData.signers}
            onSignersChange={(signers) => updateWizardData('signers', signers)}
            currentUser={currentUser}
          />
        );
      case 2:
        return (
          <AnnotateStep 
            draftFilePreviewUrl={draftFilePreviewUrl}
            annotations={wizardData.annotations}
            onAnnotationsChange={(annotations) => updateWizardData('annotations', annotations)}
            mode={wizardData.mode}
            currentUser={currentUser}
            signers={wizardData.signers}
          />
        );
      case 3:
        return (
          <ConfirmStep 
          wizardData={wizardData}
          onSubmit={handleSubmit}
          onBack={handleBack}
          currentUser={currentUser}
        />
        );
      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    if (!wizardData.mode) return 'Tanda Tangan Dokumen';
    return wizardData.mode === 'self' ? 'Tanda Tangan Sendiri' : 'Minta Tanda Tangan';
  };

  const getHeaderGradient = () => {
    if (!wizardData.mode) return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    return wizardData.mode === 'self' 
      ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)';
  };

  if (loadingUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header with Stepper */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: getHeaderGradient(),
          borderRadius: 3 
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
          {getHeaderTitle()}
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box 
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: index < activeStep 
                        ? '#22c55e' 
                        : index === activeStep 
                          ? 'white' 
                          : 'rgba(255,255,255,0.3)',
                      color: index === activeStep 
                        ? (wizardData.mode === 'self' ? '#22c55e' : '#3b82f6') 
                        : 'white',
                      transition: 'all 0.3s'
                    }}
                  >
                    {index < activeStep ? <CheckCircleIcon /> : step.icon}
                  </Box>
                )}
              >
                <Typography 
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: index <= activeStep ? 'white' : 'rgba(255,255,255,0.6)'
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 3, 
          backgroundColor: 'background.paper'
        }}
      >
        {renderStepContent()}
      </Paper>

      {/* Navigation Buttons - Hidden on mode selection and final step (ConfirmStep has its own button) */}
      {activeStep > 0 && activeStep < steps.length - 1 && (
        <Box className="flex justify-between mt-4 mb-4">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Kembali
          </Button>
          
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              disabled={!canProceed()}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                background: !canProceed() 
                  ? 'rgba(0, 0, 0, 0.12)' 
                  : (wizardData.mode === 'self'
                    ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'),
                '&:hover': {
                  background: !canProceed() 
                    ? 'rgba(0, 0, 0, 0.12)' 
                    : (wizardData.mode === 'self'
                      ? 'linear-gradient(135deg, #16a34a 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)'),
                }
              }}
            >
              Selanjutnya
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={wizardData.mode === 'self' ? <DrawIcon /> : <SendIcon />}
              onClick={handleSubmit}
              disabled={!canProceed()}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                background: !canProceed() 
                  ? 'rgba(0, 0, 0, 0.12)' 
                  : (wizardData.mode === 'self'
                    ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'),
                '&:hover': {
                  background: !canProceed() 
                    ? 'rgba(0, 0, 0, 0.12)' 
                    : (wizardData.mode === 'self'
                      ? 'linear-gradient(135deg, #16a34a 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)'),
                }
              }}
            >
              {wizardData.mode === 'self' ? 'Tanda Tangani Sekarang' : 'Kirim Permintaan'}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SignatureRequestWizard;
