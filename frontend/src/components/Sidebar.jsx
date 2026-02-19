import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from '@mui/icons-material';
import { 
  Collapse, 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuList,
} from '@mui/material';

import { hasPermission } from '~/config/roles';
import { navigationConfig } from '~/config/navigation';

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed = false, user }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Track open state for collapsible menus
  const [openMenus, setOpenMenus] = useState({
    docs: false,
    finance: true,
    productivity: false,
    utilities: false,
    inventory: false,
    pdf: false,
    reimbursement: false,
  });
  
  // Floating menu anchors (coordinates) for collapsed mode
  const [menuPositions, setMenuPositions] = useState({});

  // Auto-expand menus based on current path
  React.useEffect(() => {
    if (isCollapsed) return;

    // Check each section to see if one of its items is active
    const checkAndExpand = (sectionId, items) => {
      const hasActiveItem = items?.some(item => 
        location.pathname === item.path || 
        (item.path !== '/' && location.pathname.startsWith(item.path + '/'))
      );
      
      if (hasActiveItem) {
        setOpenMenus(prev => ({ ...prev, [sectionId]: true }));
      }
    };

    // Check main sections
    checkAndExpand('docs', navigationConfig.docs.items);
    checkAndExpand('inventory', navigationConfig.inventory.items);
    checkAndExpand('finance', navigationConfig.finance.items);
    checkAndExpand('reimbursement', navigationConfig.reimbursement.items);
    
    // Check nested tools sections
    navigationConfig.tools.subgroups?.forEach(subgroup => {
      checkAndExpand(subgroup.id, subgroup.items);
    });
    
  }, [location.pathname, isCollapsed]);

  const isActive = (path) => {
    // Exact match paths to avoid parent/child overlap highlight
    const exactMatchPaths = [
      '/inventory', 
      '/dashboard', 
      '/docs/request', 
      '/docs/inbox',
      '/inventory/loans', // Prevent highlighting parent when in child route
      '/reimbursement', // Prevent highlighting parent when in /reimbursement/admin
    ];
    
    if (exactMatchPaths.includes(path)) {
      return location.pathname === path;
    }
    
    // Default prefix matching
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };
  
  const openFloatingMenu = (menuId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPositions(prev => ({ 
      ...prev, 
      [menuId]: { top: rect.top, left: rect.right } 
    }));
  };
  
  const closeFloatingMenu = (menuId) => {
    setMenuPositions(prev => ({ ...prev, [menuId]: null }));
  };

  // Render a single navigation item
  const NavItem = ({ item, nested = false }) => {
    const Icon = item.icon;
    const text = t(item.labelKey) || item.labelKey;
    
    const content = (
      <div
        className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 mx-2 rounded-xl transition-colors duration-200 ${
          isActive(item.path)
            ? `${item.activeBg || 'bg-blue-600'} text-white shadow-md`
            : `hover:bg-gray-100 dark:hover:bg-gray-800 ${item.color ? '' : 'text-gray-500 dark:text-gray-400'}`
        } ${nested && !isCollapsed ? 'pl-8' : ''}`}
      >
        <div className={`${isCollapsed ? '' : 'mr-3'} ${isActive(item.path) ? 'text-white' : (item.color || 'text-gray-400')}`}>
          <Icon />
        </div>
        {!isCollapsed && (
          <>
            <span className={`font-medium text-sm leading-tight flex-1 ${!isActive(item.path) && item.color ? 'text-gray-700 dark:text-gray-300' : ''}`}>
              {text}
            </span>
            {(() => {
              if (!item.badge) return null;
              
              let badgeText = item.badge;
              if (typeof item.badge === 'object') {
                const { text, expiresAt } = item.badge;
                if (expiresAt && new Date() > new Date(expiresAt)) return null;
                badgeText = text;
              }

              return (
                <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0 animate-pulse shadow-md backdrop-blur-sm ${
                  isActive(item.path) 
                    ? 'bg-blue-600/80 text-white shadow-blue-500/50' 
                    : 'bg-red-500/80 text-white shadow-red-500/50'
                }`}>
                  {badgeText}
                </span>
              );
            })()}
          </>
        )}
      </div>
    );

    if (isCollapsed) {
      return (
        <Tooltip title={text} placement="right">
          <Link to={item.path} className="no-underline text-inherit block">
            {content}
          </Link>
        </Tooltip>
      );
    }

    return (
      <Link 
        to={item.path} 
        className="no-underline text-inherit block" 
        onClick={() => window.innerWidth < 1024 && toggleSidebar && toggleSidebar()}
      >
        {content}
      </Link>
    );
  };

  // Render a collapsible menu section
  const CollapsibleSection = ({ sectionId, section, nested = false }) => {
    const Icon = section.icon;
    const label = t(section.labelKey) || section.labelKey;
    const isMenuOpen = openMenus[sectionId];
    const position = menuPositions[sectionId];

    if (isCollapsed) {
      return (
        <>
          <Tooltip title={label} placement="right">
            <div
              className="flex items-center justify-center px-2 py-3 mx-2 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              onClick={(e) => openFloatingMenu(sectionId, e)}
            >
              <div className="text-gray-400">
                <Icon />
              </div>
            </div>
          </Tooltip>
          <Popover
            open={Boolean(position)}
            anchorReference="anchorPosition"
            anchorPosition={position}
            onClose={() => closeFloatingMenu(sectionId)}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            marginThreshold={0}
            PaperProps={{ 
              className: "dark:bg-gray-800 dark:text-white ml-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700",
              elevation: 4
            }}
          >
            <div className="px-4 py-2 font-semibold text-sm border-b border-gray-100 dark:border-gray-700 mb-1 outline-none">
              {label}
            </div>
            <MenuList className="p-0">
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <MenuItem 
                    key={item.id} 
                    onClick={() => {
                      navigate(item.path);
                      closeFloatingMenu(sectionId);
                    }}
                  >
                    <ListItemIcon className="min-w-[36px] text-gray-500 dark:text-gray-400">
                      <ItemIcon />
                    </ListItemIcon>
                    <ListItemText primary={t(item.labelKey) || item.labelKey} />
                  </MenuItem>
                );
              })}
            </MenuList>
          </Popover>
        </>
      );
    }

    return (
      <>
        <div
          className="flex items-center px-4 py-3 mx-2 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          onClick={() => toggleMenu(sectionId)}
        >
          <div className="mr-3 text-gray-400">
            <Icon />
          </div>
          <span className="font-medium text-sm flex-1">{label}</span>
          {isMenuOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </div>
        <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
          <div className="space-y-1 mt-1">
            {section.items.map((item) => (
              <NavItem key={item.id} item={item} nested />
            ))}
          </div>
        </Collapse>
      </>
    );
  };

  return (
    <div className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col z-[60] transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          {isCollapsed ? (
             <img src="/xs-logo-satu-data.svg" alt="Satu Data Logo" className="w-10 h-10" />
          ) : (
              <>
                <img src="/xs-logo-satu-data.svg" alt="Satu Data Logo" className="w-10 h-10" />
                <span className="text-xl font-bold text-blue-900 dark:text-white tracking-tight">Satu Data</span>
              </>
          )}
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
        {/* Main Section */}
        {!isCollapsed && (
          <p className="px-6 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            {t(navigationConfig.main.labelKey)}
          </p>
        )}
        {navigationConfig.main.items.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}

        {/* Docs Section - Collapsible */}
        <CollapsibleSection sectionId="docs" section={navigationConfig.docs} />

        {/* Inventory Section - Collapsible, with item-level permissions */}
        {(() => {
          const filteredInventoryItems = navigationConfig.inventory.items.filter(
            (item) => !item.permission || hasPermission(user.role, item.permission)
          );
          if (filteredInventoryItems.length === 0) return null;
          const inventorySection = {
            ...navigationConfig.inventory,
            items: filteredInventoryItems,
          };
          return <CollapsibleSection sectionId="inventory" section={inventorySection} />;
        })()}

        {/* Reimbursement Section - Collapsible, with item-level permissions */}
        {(() => {
          const filteredReimbursementItems = navigationConfig.reimbursement.items.filter(
            (item) => !item.permission || hasPermission(user.role, item.permission)
          );
          if (filteredReimbursementItems.length === 0) return null;
          const reimbursementSection = {
            ...navigationConfig.reimbursement,
            items: filteredReimbursementItems,
          };
          return <CollapsibleSection sectionId="reimbursement" section={reimbursementSection} />;
        })()}

        {/* Admin Section - Permission Required */}
        {hasPermission(user.role, navigationConfig.admin.permission) && (
          <>
            <div className="my-4 border-t border-gray-100 dark:border-gray-800 mx-6"></div>
            {!isCollapsed && (
              <p className="px-6 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                {t(navigationConfig.admin.labelKey)}
              </p>
            )}
            {navigationConfig.admin.items.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </>
        )}

        {/* Finance Section - Permission Required, Collapsible */}
        {hasPermission(user.role, navigationConfig.finance.permission) && (
          <CollapsibleSection sectionId="finance" section={navigationConfig.finance} />
        )}

        {/* Tools Section with Subgroups */}
        <div className="my-4 border-t border-gray-100 dark:border-gray-800 mx-6"></div>
        {!isCollapsed && (
          <p className="px-6 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            {t(navigationConfig.tools.labelKey)}
          </p>
        )}
        
        {/* Tools Subgroups (Productivity, Utilities) */}
        {navigationConfig.tools.subgroups?.map((subgroup) => (
          <CollapsibleSection key={subgroup.id} sectionId={subgroup.id} section={subgroup} nested />
        ))}
        
        {/* Standalone Tools Items */}
        {navigationConfig.tools.items?.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
