import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { IconButton, Tooltip } from '@mui/material';

const WalletCard = ({
  initialBalance = 0,
  balanceDate = new Date(),
  incomeAfterDate = 0,
  expenseAfterDate = 0,
  currentBalance = 0,
  onEdit,
  onHistory,
  loading = false
}) => {
  const { t } = useTranslation();

  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl p-8 h-80">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-white/20 rounded w-2/3 mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      {/* Main Wallet Card */}
      <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        {/* Glassmorphism decorations */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-300/10 rounded-full blur-xl"></div>

        {/* Card Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <AccountBalanceWalletIcon className="text-3xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold opacity-90">{t('wallet.title', 'Dompet Digital')}</h3>
                <p className="text-sm opacity-70">{t('wallet.original_balance', 'Saldo Asli')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Tooltip title={t('wallet.history', 'Riwayat')}>
                <IconButton
                  onClick={onHistory}
                  className="!bg-white/10 hover:!bg-white/20 !text-white backdrop-blur-sm"
                  size="small"
                >
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('wallet.edit', 'Ubah Saldo')}>
                <IconButton
                  onClick={onEdit}
                  className="!bg-white/10 hover:!bg-white/20 !text-white backdrop-blur-sm"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* Initial Balance */}
          <div className="mb-6">
            <motion.p
              className="text-4xl font-bold tracking-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {formatCurrency(initialBalance)}
            </motion.p>
            <p className="text-sm opacity-70 mt-1 flex items-center gap-1">
              📅 {t('wallet.effective_since', 'Berlaku sejak')}: {formatDate(balanceDate)}
            </p>
          </div>

          {/* Separator */}
          <div className="border-t border-white/20 my-6"></div>

          {/* Income/Expense after date */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUpIcon className="text-green-300" />
                <span className="text-sm opacity-80">{t('wallet.income_after', 'Pemasukan')}</span>
              </div>
              <p className="text-xl font-semibold text-green-300">+ {formatCurrency(incomeAfterDate)}</p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingDownIcon className="text-red-300" />
                <span className="text-sm opacity-80">{t('wallet.expense_after', 'Pengeluaran')}</span>
              </div>
              <p className="text-xl font-semibold text-red-300">- {formatCurrency(expenseAfterDate)}</p>
            </motion.div>
          </div>

          {/* Current Balance */}
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-xl p-5"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm opacity-80 mb-1">{t('wallet.current_balance', 'Saldo Saat Ini')}</p>
            <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatCurrency(currentBalance)}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletCard;
