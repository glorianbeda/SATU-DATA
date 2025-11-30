import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Search as SearchIcon, 
  NotificationsNone as BellIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';

const Header = ({ title }) => {
  const { mode, toggleTheme } = useTheme();
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{today}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-64">
            <SearchIcon className="text-gray-400 mr-2" fontSize="small" />
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full text-gray-600 dark:text-gray-200 placeholder-gray-400"
            />
        </div>

        {/* Theme Toggle Switch */}
        <div 
            onClick={toggleTheme}
            className="relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer transition-colors duration-300 shadow-sm border border-gray-100 dark:border-gray-600"
        >
            {/* Toggle Circle */}
            <div 
                className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                    mode === 'dark' ? 'translate-x-8' : 'translate-x-0'
                }`}
            >
                {mode === 'dark' ? (
                    <DarkModeIcon sx={{ fontSize: 14, color: '#fbbf24' }} />
                ) : (
                    <LightModeIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                )}
            </div>
            
            {/* Background Icons */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
                <LightModeIcon sx={{ fontSize: 14, color: mode === 'light' ? 'transparent' : '#9ca3af' }} />
                <DarkModeIcon sx={{ fontSize: 14, color: mode === 'dark' ? 'transparent' : '#9ca3af' }} />
            </div>
        </div>

        {/* Notifications */}
        <button className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-blue-600 transition-colors relative">
            <BellIcon fontSize="small" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </button>
      </div>
    </div>
  );
};

export default Header;
