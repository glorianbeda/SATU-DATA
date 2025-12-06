import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
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
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openFinance, setOpenFinance] = useState(true);
  const [user, setUser] = useState({
    name: 'Super Admin',
    email: 'admin@satudata.com',
    profilePicture: null
  });

  const isActive = (path) => location.pathname === path;

  // Fetch user profile on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.user.name || 'Super Admin',
            email: data.user.email || 'admin@satudata.com',
            profilePicture: data.user.profilePicture
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile for sidebar:', error);
      }
    };

    fetchProfile();
  }, []);

  const [openDocs, setOpenDocs] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Saldo Asli', icon: <WalletIcon />, path: '/balance' },
  ];

  const docsItems = [
    { text: 'Minta tanda tangan', icon: <EditIcon />, path: '/docs/request' },
    { text: 'Perlu Ditandatangani', icon: <DocsIcon />, path: '/docs/inbox' },
    { text: 'Validasi dokumen', icon: <CheckCircleIcon />, path: '/docs/validate' },
  ];

  const financeItems = [
    { text: 'Pemasukan', icon: <TrendingUp />, path: '/finance/income' },
    { text: 'Pengeluaran', icon: <TrendingDown />, path: '/finance/expense' },
  ];

  const bottomItems = [
    { text: 'Report to WA', icon: <WhatsAppIcon />, path: '/report/wa' },
    { text: 'Report to PDF', icon: <PdfIcon />, path: '/report/pdf' },
    { text: 'Quick Edit', icon: <EditIcon />, path: '/quick-edit' },
    { text: 'Sign System', icon: <SignIcon />, path: '/sign-system' },
  ];

  const ListItemLink = ({ item, nested = false }) => (
    <Link to={item.path} className="no-underline text-inherit block" onClick={() => window.innerWidth < 1024 && toggleSidebar && toggleSidebar()}>
      <div 
        className={`flex items-center px-4 py-3 mx-2 rounded-xl transition-colors duration-200 ${
          isActive(item.path) 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        } ${nested ? 'pl-8' : ''}`}
      >
        <div className={`mr-3 ${isActive(item.path) ? 'text-white' : 'text-gray-400'}`}>
          {item.icon}
        </div>
        <span className="font-medium text-sm">{item.text}</span>
      </div>
    </Link>
  );

  return (
    <div className={`w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm opacity-50"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Satu Data+</h1>
        </div>
        <IconButton 
            onClick={toggleSidebar} 
            className="lg:hidden text-gray-500 dark:text-gray-400"
            size="small"
        >
            <CloseIcon />
        </IconButton>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        <p className="px-6 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Menu</p>
        
        {menuItems.map((item) => (
          <ListItemLink key={item.text} item={item} />
        ))}

        {/* Collapsible OMK Docs Menu */}
        <div 
            className="flex items-center px-4 py-3 mx-2 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setOpenDocs(!openDocs)}
        >
            <div className="mr-3 text-gray-400">
                <DocsIcon />
            </div>
            <span className="font-medium text-sm flex-1">OMK Docs</span>
            {openDocs ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </div>
        
        <Collapse in={openDocs} timeout="auto" unmountOnExit>
            <div className="space-y-1 mt-1">
                {docsItems.map((item) => (
                    <ListItemLink key={item.text} item={item} nested />
                ))}
            </div>
        </Collapse>

        {/* Collapsible Finance Menu */}
        <div 
            className="flex items-center px-4 py-3 mx-2 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setOpenFinance(!openFinance)}
        >
            <div className="mr-3 text-gray-400">
                <MoneyIcon />
            </div>
            <span className="font-medium text-sm flex-1">Keuangan</span>
            {openFinance ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </div>
        
        <Collapse in={openFinance} timeout="auto" unmountOnExit>
            <div className="space-y-1 mt-1">
                {financeItems.map((item) => (
                    <ListItemLink key={item.text} item={item} nested />
                ))}
            </div>
        </Collapse>

        <div className="my-4 border-t border-gray-100 dark:border-gray-800 mx-6"></div>
        
        <p className="px-6 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Tools</p>
        {bottomItems.map((item) => (
            <ListItemLink key={item.text} item={item} />
        ))}
      </div>

      {/* User Profile (Bottom) */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <Link to="/profile" className="no-underline block">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              {!user.email ? (
                 <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                 </div>
              ) : (
                <>
                  {user.profilePicture ? (
                      <img 
                          src={user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_API_URL}${user.profilePicture}`} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover"
                      />
                  ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.name.substring(0, 2).toUpperCase()}
                      </div>
                  )}
                  <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </>
              )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
