import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ROLES } from '~/config/roles';
import { LayoutProvider, useLayout } from '~/context/LayoutContext';
import { ProtectedRoute } from './RouteGuard';

const MainLayoutContent = ({ children }) => {
  const location = useLocation();
  const { title } = useLayout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({
    name: 'User',
    email: '',
    profilePicture: null,
    role: ROLES.MEMBER
  });

  // Public paths where sidebar/header should not be shown
  const publicPaths = ['/login', '/register', '/forgot-password'];
  const isPublic = publicPaths.some(path => location.pathname === path);

  useEffect(() => {
    if (isPublic) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            // Role name is now standardized as SUPER_ADMIN, ADMIN, MEMBER
            // Handle both object (role.name) and string (role)
            const userRole = data.user.role?.name || data.user.role || ROLES.MEMBER;

            setUser({
                name: data.user.name,
                email: data.user.email,
                profilePicture: data.user.profilePicture,
                role: userRole
            });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [isPublic]); // Only fetch once when entering protected area, not on every navigation

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => !prev);
    }
  }, []);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
          user={user}
        />

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <main className={`transition-all duration-300 p-4 md:p-8 ${isSidebarOpen ? 'ml-0' : 'ml-0'} ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                  <Header title={title} toggleSidebar={toggleSidebar} user={user} />
              </div>
          </div>

          <div className="w-full overflow-x-auto">
              {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

const MainLayout = ({ children }) => {
  return (
    <LayoutProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </LayoutProvider>
  );
};

export default MainLayout;
