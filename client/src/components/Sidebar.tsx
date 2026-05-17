import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, onMobileClose }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: 'dashboard', label: 'DASHBOARD', path: '/dashboard' },
    { icon: 'person_search', label: 'LEADS', path: '/leads' },
    { icon: 'analytics', label: 'ANALYTICS', path: '/analytics' },
  ];

  if (user?.role === UserRole.ADMIN) {
    menuItems.push({ icon: 'group', label: 'USERS', path: '/admin/users' });
  }

  menuItems.push({ icon: 'settings', label: 'SETTINGS', path: '/settings' });

  return (
    <aside className="w-full h-full border-r border-outline-variant bg-surface-container-low flex flex-col justify-between py-10 px-6">
      <div className="flex flex-col gap-12">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display text-headline-lg text-primary tracking-tight">GIGFLOW</span>
            <span className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant">MANAGEMENT</span>
          </div>
          <button 
            onClick={onMobileClose} 
            className="lg:hidden p-1 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
            title="Close Menu"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) => `
                flex items-center gap-3 py-2 transition-colors duration-100
                ${isActive && item.path !== '/leads?action=create'
                  ? 'text-primary font-bold border-r-4 border-primary pr-4 active:scale-[0.99]' 
                  : 'text-on-surface-variant font-normal hover:text-primary'}
              `}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-sm text-label-sm tracking-widest uppercase">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-4 border-t border-outline-variant pt-8">
        <button onClick={logout} className="flex items-center gap-3 text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-sm text-label-sm tracking-widest uppercase">LOGOUT</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
