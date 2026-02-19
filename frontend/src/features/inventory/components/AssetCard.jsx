import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { AddShoppingCart, RemoveShoppingCart, Image as ImageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useCart } from '~/context/CartContext';

const AssetCard = ({ asset }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { addToCart, removeFromCart, isInCart } = useCart();

  const isSelected = isInCart(asset.id);
  const isAvailable = asset.status === 'AVAILABLE';

  const handleAction = () => {
    if (isSelected) {
      removeFromCart(asset.id);
    } else {
      addToCart(asset);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
        {/* Status Chip */}
        <Chip
            label={t(`inventory.${asset.status.toLowerCase()}`)}
            color={isAvailable ? 'success' : 'default'}
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8,
              zIndex: 1,
              fontWeight: 500,
            }}
        />

      <CardMedia
        component="div"
        sx={{ 
          height: 160, 
          bgcolor: isDark ? 'grey.900' : 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {asset.imageUrl ? (
          <img 
            src={asset.imageUrl} 
            alt={asset.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <ImageIcon sx={{ fontSize: 48, color: isDark ? 'grey.600' : 'grey.400' }} />
        )}
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: 600 }}>
          {asset.name}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('inventory.code')}: {asset.assetCode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
              {t('inventory.category')}: {asset.category?.name || '-'}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2.5, pt: 0 }}>
        <Button
          variant={isSelected ? "outlined" : "contained"}
          color={isSelected ? "error" : "primary"}
          fullWidth
          startIcon={isSelected ? <RemoveShoppingCart /> : <AddShoppingCart />}
          onClick={handleAction}
          disabled={!isAvailable && !isSelected}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {isSelected ? t('inventory.remove_from_cart') : t('inventory.add_to_cart')}
        </Button>
      </Box>
    </Card>
  );
};

export default AssetCard;
