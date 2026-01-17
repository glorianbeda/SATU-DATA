import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepConnector, useTheme, useMediaQuery } from '@mui/material';
import {
  RequestPage,
  CheckCircle,
  AssignmentReturn,
  VerifiedUser,
  DoneAll,
  Cancel
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

// Custom Connector
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${StepConnector.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${StepConnector.active}`]: {
    [`& .${StepConnector.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${StepConnector.completed}`]: {
    [`& .${StepConnector.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${StepConnector.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
  ...(ownerState.error && {
      backgroundColor: theme.palette.error.main,
  })
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon, error } = props;

  const icons = {
    1: <RequestPage />,
    2: <CheckCircle />,
    3: <AssignmentReturn />, // Icon for Borrowed -> Return
    4: <VerifiedUser />,
    5: <DoneAll />,
    99: <Cancel />
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active, error }} className={className}>
      {icons[String(icon)] || icons[1]}
    </ColorlibStepIconRoot>
  );
}

const LoanTimeline = ({ status }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Define steps
  const steps = [
    { label: t('inventory.pending'), status: 'PENDING' },
    { label: t('inventory.approved'), status: 'APPROVED' },
    { label: t('inventory.borrowed'), status: 'BORROWED' },
    { label: t('inventory.return_verification'), status: 'RETURN_VERIFICATION' },
    { label: t('inventory.returned'), status: 'RETURNED' },
  ];

  // Determine active step
  let activeStep = 0;
  let isError = false;

  if (status === 'REJECTED') {
      activeStep = 1; // Show as failed at step 1 or separate?
      isError = true;
  } else {
      activeStep = steps.findIndex(s => s.status === status);
      if (activeStep === -1 && status === 'RETURNED') activeStep = 4; // Should match
      // If status is current, activeStep is index.
      // E.g. PENDING -> 0 (Active).
      // If we want completed steps to look completed, we use activeStep + 1?
      // Stepper logic: activeStep is the index of the step currently in progress.
      // But here status IS the current state.
      // So if PENDING, step 0 is active.
      // If RETURNED, step 4 is completed? Or Active?
      // Let's say if RETURNED, all formatted as completed.
  }
  
  // Handling Rejected specifically
  if (status === 'REJECTED') {
      return (
           <Box sx={{ width: '100%', mb: 4 }}>
                <Typography variant="h6" gutterBottom>{t('inventory.loan_timeline')}</Typography>
                <Stepper alternativeLabel activeStep={1}>
                    <Step completed>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{steps[0].label}</StepLabel>
                    </Step>
                    <Step active error>
                         <StepLabel error StepIconComponent={(props) => <ColorlibStepIcon {...props} icon={99} error />}>
                             {t('inventory.rejected')}
                         </StepLabel>
                    </Step>
                </Stepper>
           </Box>
      )
  }

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h6" gutterBottom>{t('inventory.loan_timeline')}</Typography>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default LoanTimeline;
