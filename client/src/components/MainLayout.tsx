import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar collapsed={false} setCollapsed={() => {}} onMobileClose={() => setMobileMenuOpen(false)} />
      </div>

      <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
      
      <main className="lg:ml-64 pt-24 px-6 pb-6 lg:pt-28 lg:px-10 lg:pb-10 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
