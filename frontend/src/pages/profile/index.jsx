import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import ProfileEditForm from '~/features/profile/components/ProfileEditForm';
import ChangePasswordForm from '~/features/profile/components/ChangePasswordForm';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { motion } from 'motion/react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <main className={`transition-all duration-300 p-8 ${isSidebarOpen ? 'ml-0' : 'ml-0'} lg:ml-64`}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-4 mb-6">
                <IconButton 
                    onClick={toggleSidebar} 
                    className="lg:hidden text-gray-800 dark:text-white"
                    edge="start"
                >
                    <MenuIcon />
                </IconButton>
                <div className="flex-1">
                    <Header title={t('profile.title')} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-8">
                <ProfileEditForm />
            </div>
            <div className="flex flex-col gap-8">
                <ChangePasswordForm />
            </div>
            </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;
