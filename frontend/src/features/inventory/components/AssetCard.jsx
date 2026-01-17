import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { AddShoppingCart, RemoveShoppingCart } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useCart } from '~/context/CartContext';

const AssetCard = ({ asset }) => {
  const { t } = useTranslation();
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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Status Chip */}
        <Chip
            label={t(`inventory.${asset.status.toLowerCase()}`)}
            color={isAvailable ? 'success' : 'default'}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
        />

      <CardMedia
        component="img"
        height="140"
        image={asset.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={asset.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {asset.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('inventory.code')}: {asset.assetCode}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {t('inventory.category')}: {asset.category?.name || '-'}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant={isSelected ? "outlined" : "contained"}
          color={isSelected ? "error" : "primary"}
          fullWidth
          startIcon={isSelected ? <RemoveShoppingCart /> : <AddShoppingCart />}
          onClick={handleAction}
          disabled={!isAvailable && !isSelected}
        >
          {isSelected ? t('inventory.remove_from_cart') : t('inventory.add_to_cart')}
        </Button>
      </Box>
    </Card>
  );
};

export default AssetCard;
