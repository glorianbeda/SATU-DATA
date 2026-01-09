import React, { useState } from 'react';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ProtectedRoute } from '~/components/RouteGuard';
import { useTheme } from '~/context/ThemeContext';
import api from '~/utils/api';
import { ROLES } from '~/config/roles';

/**
 * AppLayout - Wrapper layout with sidebar and header for non-dashboard pages
 * Automatically protects routes - redirects to login if not authenticated
 */
const AppLayout = ({ children, title = '' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [user, setUser] = useState({
    name: 'Super Admin',
    email: 'admin@satudata.com',
    profilePicture: null,
    role: ROLES.SUPER_ADMIN
  });

  // Fetch user profile
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile');
        const data = response.data;
        setUser({
          name: data.user.name || 'Super Admin',
          email: data.user.email || 'admin@satudata.com',
          profilePicture: data.user.profilePicture,
          role: data.user.role || ROLES.MEMBER
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Sidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
            isCollapsed={isCollapsed}
            user={user}
        />
        
        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        
        <main className={`transition-all duration-300 p-8 ${isSidebarOpen ? 'ml-0' : 'ml-0'} ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Header title={title} toggleSidebar={toggleSidebar} user={user} />
            </div>
          </div>

          {/* Page Content */}
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AppLayout;

