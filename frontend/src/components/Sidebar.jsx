import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Dashboard as DashboardIcon,
  Description as DocsIcon,
  AccountBalanceWallet as WalletIcon,
  AttachMoney as MoneyIcon,
  WhatsApp as WhatsAppIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
  Traffic as SignIcon,
  ExpandLess,
  ExpandMore,
  TrendingUp,
  TrendingDown,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';

import { hasPermission, ROLES } from '~/config/roles';

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed = false, user }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [openFinance, setOpenFinance] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  // Floating menu states for collapsed mode
  const [anchorElDocs, setAnchorElDocs] = useState(null);
  const [anchorElFinance, setAnchorElFinance] = useState(null);

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showSuccess(t('common.logout_success') || 'Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const [openDocs, setOpenDocs] = useState(false);

  const menuItems = [
    { text: t('sidebar.dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
    { text: t('sidebar.balance'), icon: <WalletIcon />, path: '/balance' },
  ];

  const adminItems = [
    { text: t('sidebar.user_management'), icon: <PeopleIcon />, path: '/admin/users' },
  ];

  const docsItems = [
    { text: t('sidebar.request_signature'), icon: <EditIcon />, path: '/docs/request' },
    { text: t('sidebar.needs_signature'), icon: <DocsIcon />, path: '/docs/inbox' },
    { text: t('sidebar.validate_docs'), icon: <CheckCircleIcon />, path: '/docs/validate' },
  ];

  const financeItems = [
    { text: t('sidebar.income'), icon: <TrendingUp />, path: '/finance/income' },
    { text: t('sidebar.expense'), icon: <TrendingDown />, path: '/finance/expense' },
  ];

  const bottomItems = [
    { text: t('sidebar.report_wa'), icon: <WhatsAppIcon />, path: '/report/wa' },
    { text: t('sidebar.report_pdf'), icon: <PdfIcon />, path: '/report/pdf' },
    { text: t('sidebar.quick_edit'), icon: <EditIcon />, path: '/quick-edit' },
    { text: t('sidebar.sign_system'), icon: <SignIcon />, path: '/sign-system' },
  ];

  const ListItemLink = ({ item, nested = false }) => {
    const content = (
      <div 
        className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 mx-2 rounded-xl transition-colors duration-200 ${
          isActive(item.path) 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        } ${nested && !isCollapsed ? 'pl-8' : ''}`}
      >
        <div className={`${isCollapsed ? '' : 'mr-3'} ${isActive(item.path) ? 'text-white' : 'text-gray-400'}`}>
          {item.icon}
        </div>
        {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.text}</span>}
      </div>
    );

    if (isCollapsed) {
      return (
        <Tooltip title={item.text} placement="right">
          <Link to={item.path} className="no-underline text-inherit block">
            {content}
          </Link>
        </Tooltip>
      );
    }

    return (
      <Link to={item.path} className="no-underline text-inherit block" onClick={() => window.innerWidth < 1024 && toggleSidebar && toggleSidebar()}>
        {content}
      </Link>
    );
  };

  return (
    <div className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-sm opacity-50"></div>
            </div>
            {!isCollapsed && <h1 className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">Satu Data+</h1>}
        </div>
        <IconButton 
            onClick={toggleSidebar} 
            sx={{ display: { lg: 'none' } }}
            className="text-gray-500 dark:text-gray-400"
            size="small"
        >
            <CloseIcon />
        </IconButton>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 overflow-x-hidden">
        {!isCollapsed && <p className="px-6 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t('sidebar.menu')}</p>}
        
        {menuItems.map((item) => (
          <ListItemLink key={item.text} item={item} />
        ))}

        {/* Collapsible OMK Docs Menu - For all users */}
        {isCollapsed ? (
            <>
                <Tooltip title={t('sidebar.omk_docs')} placement="right">
                    <div 
                        className="flex items-center justify-center px-2 py-3 mx-2 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        onClick={(e) => setAnchorElDocs(e.currentTarget)}
                    >
                        <div className="text-gray-400">
                            <DocsIcon />
                        </div>
                    </div>
                </Tooltip>
                <Menu
                    anchorEl={anchorElDocs}
                    open={Boolean(anchorElDocs)}
                    onClose={() => setAnchorElDocs(null)}
                    anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                    PaperProps={{
                        className: "dark:bg-gray-800 dark:text-white ml-2"
                    }}
                >
                    <div className="px-4 py-2 font-semibold text-sm border-b border-gray-100 dark:border-gray-700 mb-1 outline-none">
                        {t('sidebar.omk_docs')}
                    </div>
                    {docsItems.map((item) => (
                        <MenuItem key={item.text} onClick={() => {
                            navigate(item.path);
                            setAnchorElDocs(null);
                        }}>
                            <ListItemIcon className="min-w-[36px] text-gray-500 dark:text-gray-400">
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </MenuItem>
                    ))}
                </Menu>
            </>
        ) : (
            <>
                <div 
                    className="flex items-center px-4 py-3 mx-2 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setOpenDocs(!openDocs)}
                >
                    <div className="mr-3 text-gray-400">
                        <DocsIcon />
                    </div>
                    <span className="font-medium text-sm flex-1">{t('sidebar.omk_docs')}</span>
                    {openDocs ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </div>
                
                <Collapse in={openDocs} timeout="auto" unmountOnExit>
                    <div className="space-y-1 mt-1">
                        {docsItems.map((item) => (
                            <ListItemLink key={item.text} item={item} nested />
                        ))}
                    </div>
                </Collapse>
            </>
        )}

        {/* Admin Section - Only show if user has permission */}
        {hasPermission(user.role, 'canManageUsers') && adminItems.length > 0 && (
          <>
            <div className="my-4 border-t border-gray-100 dark:border-gray-800 mx-6"></div>
            {!isCollapsed && <p className="px-6 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t('sidebar.admin')}</p>}
            {adminItems.map((item) => (
              <ListItemLink key={item.text} item={item} />
            ))}
          </>
        )}

        {/* Collapsible Finance Menu */}
        {hasPermission(user.role, 'canManageFinance') && (
          isCollapsed ? (
            <>
                <Tooltip title={t('sidebar.finance')} placement="right">
                    <div 
                        className="flex items-center justify-center px-2 py-3 mx-2 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        onClick={(e) => setAnchorElFinance(e.currentTarget)}
                    >
                        <div className="text-gray-400">
                            <MoneyIcon />
                        </div>
                    </div>
                </Tooltip>
                <Menu
                    anchorEl={anchorElFinance}
                    open={Boolean(anchorElFinance)}
                    onClose={() => setAnchorElFinance(null)}
                    anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                    PaperProps={{
                        className: "dark:bg-gray-800 dark:text-white ml-2"
                    }}
                >
                    <div className="px-4 py-2 font-semibold text-sm border-b border-gray-100 dark:border-gray-700 mb-1 outline-none">
                        {t('sidebar.finance')}
                    </div>
                    {financeItems.map((item) => (
                        <MenuItem key={item.text} onClick={() => {
                            navigate(item.path);
                            setAnchorElFinance(null);
                        }}>
                            <ListItemIcon className="min-w-[36px] text-gray-500 dark:text-gray-400">
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </MenuItem>
                    ))}
                </Menu>
            </>
          ) : (
            <>
                <div 
                    className="flex items-center px-4 py-3 mx-2 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setOpenFinance(!openFinance)}
                >
                    <div className="mr-3 text-gray-400">
                        <MoneyIcon />
                    </div>
                    <span className="font-medium text-sm flex-1">{t('sidebar.finance')}</span>
                    {openFinance ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </div>
                
                <Collapse in={openFinance} timeout="auto" unmountOnExit>
                    <div className="space-y-1 mt-1">
                        {financeItems.map((item) => (
                            <ListItemLink key={item.text} item={item} nested />
                        ))}
                    </div>
                </Collapse>
            </>
          )
        )}

        <div className="my-4 border-t border-gray-100 dark:border-gray-800 mx-6"></div>
        
        {!isCollapsed && <p className="px-6 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t('sidebar.tools')}</p>}
        {bottomItems.map((item) => (
            <ListItemLink key={item.text} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
