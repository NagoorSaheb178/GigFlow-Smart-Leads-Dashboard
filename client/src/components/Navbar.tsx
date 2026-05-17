import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { UserRole } from '../types';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [showDropdown, setShowDropdown] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'OVERVIEW';
    if (path.includes('/leads')) return 'LEADS';
    if (path.includes('/analytics')) return 'ANALYTICS';
    if (path.includes('/settings')) return 'SETTINGS';
    if (path.includes('/admin/users')) return 'USERS';
    return 'DASHBOARD';
  };

  return (
    <header className="fixed top-0 left-0 lg:ml-64 right-0 h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-4 lg:px-10 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="font-headline-md text-[16px] lg:text-headline-md font-medium text-primary tracking-widest uppercase">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-6">
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-surface border border-outline-variant px-4 py-1.5 focus-within:border-primary transition-colors">
          <span className="material-symbols-outlined text-[18px] text-outline mr-2">search</span>
          <input 
            type="text" 
            placeholder="Search system..." 
            className="bg-transparent border-none focus:outline-none text-on-surface font-body-sm text-[12px] w-48 placeholder:text-outline uppercase tracking-widest"
          />
        </div>

        <div className="flex gap-2">
          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          
          {/* Notification Icon */}
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>
        
        {/* Profile Dropdown */}
        <div className="flex items-center gap-3">
          {user && (
            <span className={`px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase border ${
              user.role === UserRole.ADMIN 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-outline text-on-surface-variant bg-surface-container-low'
            }`}>
              {user.role === UserRole.ADMIN ? 'ADMIN' : 'SALES'}
            </span>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:bg-surface-container-lowest p-1 pr-2 transition-colors border border-transparent hover:border-outline-variant"
            >
              <div className="w-8 h-8 bg-primary flex items-center justify-center text-xs font-bold text-on-primary">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-outline-variant shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-outline-variant mb-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-body-md text-on-surface font-bold truncate">{user?.name}</p>
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase border ${
                      user?.role === UserRole.ADMIN 
                        ? 'border-primary text-primary' 
                        : 'border-outline text-on-surface-variant'
                    }`}>
                      {user?.role === UserRole.ADMIN ? 'ADMIN' : 'SALES'}
                    </span>
                  </div>
                  <p className="font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase truncate">{user?.email}</p>
                </div>
              <button 
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 font-label-sm text-[10px] tracking-widest uppercase text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
                Profile & Settings
              </button>
              <button 
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 font-label-sm text-[10px] tracking-widest uppercase text-error hover:bg-error/10 transition-colors flex items-center gap-2 mt-1"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Logout
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


