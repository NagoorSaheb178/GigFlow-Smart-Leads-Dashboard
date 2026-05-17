import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { user, updateUser, logout } = useAuth();
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Forms state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const response = await api.put('/auth/profile', {
        name: profileForm.name,
        email: profileForm.email,
      });
      
      // Update global context & local storage
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoadingPassword(true);
    try {
      await api.put('/auth/profile', { password: passwordData.newPassword });
      toast.success('Password updated successfully');
      setShowPasswordForm(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-gutter">
      {/* Header Area */}
      <div className="mb-4">
        <h1 className="font-headline-md text-headline-md tracking-tight uppercase text-on-surface">SYSTEM PREFERENCES</h1>
        <p className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant mt-2">Personalize your platform experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Account, Appearance & Security */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          
          {/* Profile Card */}
          <div className="bg-surface border border-outline-variant p-8">
            <h2 className="font-label-sm text-label-sm tracking-widest uppercase text-outline mb-6">ACCOUNT PROFILE</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">FULL NAME</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loadingProfile}
                className="bg-primary border border-primary text-on-primary px-8 py-3 font-label-sm uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50"
              >
                {loadingProfile ? 'SAVING...' : 'SAVE PROFILE'}
              </button>
            </form>
          </div>
          
          {/* Appearance Card */}
          <div className="bg-surface border border-outline-variant p-8">
            <h2 className="font-label-sm text-label-sm tracking-widest uppercase text-outline mb-6">APPEARANCE</h2>
            
            <div className="flex items-center justify-between p-4 border border-outline-variant">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[24px] text-on-surface">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
                <div>
                  <p className="font-body-md text-on-surface uppercase">THEME MODE</p>
                  <p className="font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase mt-1">
                    {isDark ? 'DARK MODE ENABLED' : 'LIGHT MODE ENABLED'}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className={`relative w-16 h-8 border transition-colors ${isDark ? 'border-primary bg-primary' : 'border-outline bg-surface'}`}
              >
                <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 transition-transform ${isDark ? 'bg-on-primary translate-x-9' : 'bg-outline translate-x-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-surface border border-outline-variant p-8">
            <h2 className="font-label-sm text-label-sm tracking-widest uppercase text-outline mb-6">SECURITY</h2>
            
            <div className="flex flex-col border border-outline-variant">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-lowest transition-colors"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[24px] text-on-surface">lock</span>
                  <div>
                    <p className="font-body-md text-on-surface uppercase">AUTHENTICATION</p>
                    <p className="font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase mt-1">Update your access credentials</p>
                  </div>
                </div>
                <button className="font-label-sm text-[10px] tracking-widest text-primary uppercase flex items-center gap-1">
                  {showPasswordForm ? 'CLOSE' : 'UPDATE'}
                  <span className="material-symbols-outlined text-[16px]">{showPasswordForm ? 'expand_less' : 'expand_more'}</span>
                </button>
              </div>

              {showPasswordForm && (
                <div className="p-6 border-t border-outline-variant bg-surface-bright">
                  <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                    <div>
                      <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">NEW PASSWORD</label>
                      <input 
                        type="password" 
                        required
                        className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">CONFIRM PASSWORD</label>
                      <input 
                        type="password" 
                        required
                        className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loadingPassword}
                      className="w-full bg-primary border border-primary text-on-primary py-3 font-label-sm uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50"
                    >
                      {loadingPassword ? 'PROCESSING...' : 'UPDATE CREDENTIALS'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Danger Zone & Status */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface border border-outline-variant p-8">
            <h2 className="font-label-sm text-label-sm tracking-widest uppercase text-outline mb-6">SESSION MANAGEMENT</h2>
            
            <p className="font-body-md text-on-surface-variant mb-6 text-sm">
              Terminating your active session will require re-authentication for future access.
            </p>
            
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 font-label-sm text-label-sm tracking-widest uppercase border border-error text-error py-3 hover:bg-error hover:text-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              TERMINATE SESSION
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Settings;
