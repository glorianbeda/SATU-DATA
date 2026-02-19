import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, useTheme, Drawer, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
    ShoppingCart,
    Rule,
    Handshake,
    AssignmentReturn,
    VerifiedUser,
    Info as InfoIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import ModalWrapper from '~/components/ModalWrapper';

const BorrowingWorkflow = ({ sx = {} }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [detailOpen, setDetailOpen] = useState(false);

  const steps = [
    {
      label: t('inventory.request', 'Request'),
      description: t('inventory.workflow_request_desc', 'Pilih & ajukan'),
      icon: <ShoppingCart />,
    },
    {
      label: t('inventory.approve', 'Review'),
      description: t('inventory.workflow_approve_desc', 'Admin menyetujui'),
      icon: <Rule />,
    },
    {
      label: t('inventory.borrow', 'Ambil'),
      description: t('inventory.workflow_borrow_desc', 'Ambil aset'),
      icon: <Handshake />,
    },
    {
      label: t('inventory.return', 'Kembali'),
      description: t('inventory.workflow_return_desc', 'Kembalikan aset'),
      icon: <AssignmentReturn />,
    },
    {
      label: t('inventory.verify', 'Selesai'),
      description: t('inventory.workflow_verify_desc', 'Admin verifikasi'),
      icon: <VerifiedUser />,
    },
  ];

  const detailedSteps = [
    {
      title: t('inventory.request', 'Request'),
      description: t('inventory.workflow_request_detail_desc', 'Pilih aset yang ingin dipinjam dari daftar tersedia. Klik tombol "Tambah ke Keranjang" untuk memilih. Setelah memilih, klik ikon keranjang di bawah kanan layar untuk melihat keranjang dan mengajukan peminjaman.'),
    },
    {
      title: t('inventory.approve', 'Review'),
      description: t('inventory.workflow_approve_detail_desc', 'Admin akan menerima notifikasi dan meninjau permintaan peminjaman Anda. Status akan berubah menjadi "Disetujui" jika disetujui, atau "Ditolak" jika tidak memenuhi syarat.'),
    },
    {
      title: t('inventory.borrow', 'Ambil'),
      description: t('inventory.workflow_borrow_detail_desc', 'Setelah disetujui, ambil aset dari lokasi penyimpanan. Admin akan mencatat waktu peminjaman dan status berubah menjadi "Dipinjam".'),
    },
    {
      title: t('inventory.return', 'Kembalikan'),
      description: t('inventory.workflow_return_detail_desc', 'Kembalikan aset sebelum atau tepat pada tanggal jatuh tempo. Upload foto kondisi aset saat pengembalian.'),
    },
    {
      title: t('inventory.verify', 'Selesai'),
      description: t('inventory.workflow_verify_detail_desc', 'Admin memverifikasi kondisi aset yang dikembalikan. Jika OK, peminjaman ditandai selesai dan aset kembali tersedia.'),
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
                {t('inventory.borrowing_workflow', 'Alur Peminjaman')}
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
        title={t('inventory.borrowing_workflow_detail', 'Detail Alur Peminjaman')}
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

export default BorrowingWorkflow;
