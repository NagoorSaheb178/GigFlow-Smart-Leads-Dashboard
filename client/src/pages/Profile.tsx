import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar, 
  Camera,
  Edit2,
  Lock,
  Bell,
  Globe,
  Save,
  X
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-primary-500/5 border border-gray-100 dark:border-gray-700 overflow-hidden glass-card">
        <div className="h-48 bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
          <div className="absolute -bottom-16 left-8 p-1.5 bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border-4 border-white dark:border-gray-800">
            <div className="w-32 h-32 rounded-[1.8rem] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-primary-600 dark:text-primary-400 text-5xl font-black shadow-inner">
              {user?.name?.charAt(0)}
            </div>
            <button className="absolute bottom-2 right-2 p-2.5 bg-white dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-600 text-gray-500 hover:text-primary-600 transition-all hover:scale-110 active:scale-90">
              <Camera size={18} />
            </button>
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-primary-600 font-bold flex items-center gap-2 mt-1">
                <Shield size={16} />
                {user?.role}
              </p>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary !rounded-2xl"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary !text-rose-500 !bg-rose-50 dark:!bg-rose-900/10 !border-transparent !rounded-2xl"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={loading}
                  className="btn btn-primary !rounded-2xl"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-12">
            {isEditing ? (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-transparent hover:border-primary-500/20 transition-all group">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Email Address</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-transparent hover:border-emerald-500/20 transition-all group">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Access Level</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Lock, label: 'Security', desc: 'Password and auth settings', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
          { icon: Bell, label: 'Alerts', desc: 'Notification preferences', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { icon: Globe, label: 'Language', desc: 'Set regional preferences', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group card-hover cursor-pointer">
            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{item.label}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;

