import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BalanceCard from './BalanceCard';
import SummaryCard from './SummaryCard';
import ActivityHeatmap from './ActivityHeatmap';
import TrafficSourcesCard from './TrafficSourcesCard';
import WeeklySalesCard from './WeeklySalesCard';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import ContentLoader from '~/components/ContentLoader';

import { ROLES } from '~/config/roles';

const DashboardLayout = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    name: 'Super Admin',
    email: 'admin@satudata.com',
    profilePicture: null,
    role: ROLES.SUPER_ADMIN
  });

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Simulate data fetching
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user profile
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
            profilePicture: data.user.profilePicture,
            role: data.user.role || ROLES.MEMBER
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Dummy data for charts
  const incomeData = [
    { value: 4000 }, { value: 3000 }, { value: 2000 }, { value: 2780 },
    { value: 1890 }, { value: 2390 }, { value: 3490 }
  ];
  
  const expenseData = [
    { value: 2400 }, { value: 1398 }, { value: 9800 }, { value: 3908 },
    { value: 4800 }, { value: 3800 }, { value: 4300 }
  ];

  return (
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
                <Header title={t('dashboard.title')} toggleSidebar={toggleSidebar} user={user} />
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column - Financials */}
            <div className="md:col-span-4 flex flex-col gap-6">
                {isLoading ? <ContentLoader height="h-48" /> : <BalanceCard />}
                
                <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                        <>
                            <ContentLoader height="h-32" />
                            <ContentLoader height="h-32" />
                        </>
                    ) : (
                        <>
                            <SummaryCard 
                                title={t('dashboard.summary.total_income')} 
                                value="Rp 45.2M" 
                                percentage={12} 
                                data={incomeData} 
                                color="#10b981" // Green
                            />
                            <SummaryCard 
                                title={t('dashboard.summary.total_expense')} 
                                value="Rp 12.8M" 
                                percentage={-5} 
                                data={expenseData} 
                                color="#ef4444" // Red
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Right Column - Activity & Others */}
            <div className="md:col-span-8 flex flex-col gap-6">
                {isLoading ? <ContentLoader height="h-80" /> : <ActivityHeatmap />}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {isLoading ? (
                        <>
                            <ContentLoader height="h-64" />
                            <ContentLoader height="h-64" />
                        </>
                    ) : (
                        <>
                            <TrafficSourcesCard />
                            <WeeklySalesCard />
                        </>
                    )}
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
