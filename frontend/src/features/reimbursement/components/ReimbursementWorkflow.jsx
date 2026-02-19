import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, useTheme, Drawer, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
    Receipt,
    Send,
    CheckCircle,
    Cancel,
    DoneAll,
    Info as InfoIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import ModalWrapper from '~/components/ModalWrapper';

const ReimbursementWorkflow = ({ sx = {} }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [detailOpen, setDetailOpen] = useState(false);

  const steps = [
    {
      label: t('reimbursement.workflow_submit', 'Ajukan'),
      description: t('reimbursement.workflow_submit_desc', 'Isi formulir'),
      icon: <Receipt />,
    },
    {
      label: t('reimbursement.workflow_pending', 'Menunggu'),
      description: t('reimbursement.workflow_pending_desc', 'Review admin'),
      icon: <Send />,
    },
    {
      label: t('reimbursement.workflow_approved', 'Disetujui'),
      description: t('reimbursement.workflow_approved_desc', 'Diproses'),
      icon: <CheckCircle />,
    },
    {
      label: t('reimbursement.workflow_completed', 'Selesai'),
      description: t('reimbursement.workflow_completed_desc', 'Dana dicairkan'),
      icon: <DoneAll />,
    },
  ];

  const detailedSteps = [
    {
      title: t('reimbursement.workflow_submit', 'Ajukan'),
      description: t('reimbursement.workflow_submit_detail_desc', 'Klik tombol "Ajukan Reimbursement" lalu isi formulir dengan jumlah uang, metode pencairan (tunai/transfer bank/cashless), nomor rekening atau HP, dan upload bukti nota.'),
    },
    {
      title: t('reimbursement.workflow_pending', 'Menunggu Review'),
      description: t('reimbursement.workflow_pending_detail_desc', 'Permintaan Anda akan masuk ke daftar antrian menunggu review dari admin keuangan. Status akan terlihat di tabel reimbursement.'),
    },
    {
      title: t('reimbursement.workflow_approved', 'Disetujui & Diproses'),
      description: t('reimbursement.workflow_approved_detail_desc', 'Admin akan menyetujui permintaan jika semua persyaratan terpenuhi. Dana akan diproses sesuai metode pencairan yang dipilih.'),
    },
    {
      title: t('reimbursement.workflow_completed', 'Selesai'),
      description: t('reimbursement.workflow_completed_detail_desc', 'Setelah dana dicairkan, status berubah menjadi "Selesai". Anda dapat mengunduh kwitansi/resi dari tombol receipt di tabel.'),
    },
  ];


  return (
    <>
      <Card sx={{ height: '100%', ...sx }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight="600">
                {t('reimbursement.workflow_title', 'Alur Reimbursement')}
              </Typography>
            </Box>
            <Button 
              size="small" 
              variant="outlined"
              color="primary"
              onClick={() => setDetailOpen(true)}
              sx={{ minWidth: 80 }}
            >
              {t('common.details', 'Detail')}
            </Button>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {/* Connecting Line */}
            <Box 
              sx={{
                position: 'absolute',
                top: 20,
                left: 40,
                right: 40,
                height: 2,
                bgcolor: isDark ? 'grey.700' : 'grey.300',
                zIndex: 0,
              }}
            />
            
            {steps.map((step) => (
              <Box 
                key={step.label}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  flex: 1,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Box 
                  sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: isDark ? 'grey.800' : 'primary.light',
                    color: isDark ? 'grey.300' : 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 0.5,
                    border: '2px solid',
                    borderColor: isDark ? 'grey.700' : 'background.paper',
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="caption" fontWeight="600" textAlign="center">
                  {step.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <ModalWrapper
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={t('reimbursement.workflow_detail_title', 'Detail Alur Reimbursement')}
        maxWidth="sm"
        showSubmit={false}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {detailedSteps.map((step, index) => (
            <Box 
              key={step.title}
              sx={{ 
                display: 'flex', 
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: isDark ? 'grey.800' : 'grey.50',
              }}
            >
              <Box 
                sx={{ 
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 600,
                }}
              >
                {index + 1}
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="600">
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </ModalWrapper>
    </>
  );
};

export default ReimbursementWorkflow;
