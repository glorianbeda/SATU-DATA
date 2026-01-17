import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepContent, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
    ShoppingCart,
    Rule,
    Handshake,
    AssignmentReturn,
    VerifiedUser
} from '@mui/icons-material';

const BorrowingWorkflow = ({ sx = {} }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const steps = [
    {
      label: t('inventory.request'),
      description: t('inventory.workflow_request_desc', 'Choose assets from the shop and submit a loan request.'),
      icon: <ShoppingCart />
    },
    {
      label: t('inventory.approve'),
      description: t('inventory.workflow_approve_desc', 'Admin reviews and approves your request.'),
      icon: <Rule />
    },
    {
      label: t('inventory.borrow'),
      description: t('inventory.workflow_borrow_desc', 'Pick up the asset. Admin marks it as Borrowed.'),
      icon: <Handshake />
    },
    {
      label: t('inventory.return'),
      description: t('inventory.workflow_return_desc', 'Return the asset and upload a condition photo.'),
      icon: <AssignmentReturn />
    },
    {
      label: t('inventory.verify'),
      description: t('inventory.workflow_verify_desc', 'Admin verifies the return condition to close the loan.'),
      icon: <VerifiedUser />
    },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, height: '100%', ...sx }}>
      <Typography variant="h6" gutterBottom>
        {t('inventory.borrowing_workflow')}
      </Typography>
      <Stepper orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label} active={true}>
            <StepLabel icon={step.icon}>
              <Typography variant="subtitle1" fontWeight="bold">
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default BorrowingWorkflow;
