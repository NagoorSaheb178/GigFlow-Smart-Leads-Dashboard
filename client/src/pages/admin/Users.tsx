import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, UserRole } from '../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.SALES,
  });
  const [editRoleValue, setEditRoleValue] = useState<UserRole>(UserRole.SALES);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/users', onboardForm);
      toast.success('Personnel onboarded successfully');
      setIsOnboardOpen(false);
      setOnboardForm({
        name: '',
        email: '',
        password: '',
        role: UserRole.SALES,
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to onboard personnel');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const userId = selectedUser._id || selectedUser.id;
      await api.put(`/admin/users/${userId}/role`, { role: editRoleValue });
      toast.success('Permissions updated successfully');
      setIsEditRoleOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update permissions');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userToDelete: User) => {
    const userId = userToDelete._id || userToDelete.id;
    if (currentUser?.id === userId || currentUser?._id === userId) {
      toast.error('You cannot delete your own session');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently remove ${userToDelete.name}?`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('Personnel removed successfully');
        fetchUsers();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to remove user');
      }
    }
  };

  // Local state search filter
  const filteredUsers = users.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-gutter">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="font-headline-md text-headline-md tracking-tight uppercase text-on-surface">PERSONNEL DECK</h1>
          <p className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant mt-2">Administrative control over platform users.</p>
        </div>
        
        <button 
          onClick={() => setIsOnboardOpen(true)}
          className="flex items-center gap-2 font-label-sm text-label-sm border border-primary px-6 py-2 bg-primary text-on-primary hover:bg-on-surface transition-colors uppercase"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          ONBOARD USER
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md w-full mb-2">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full bg-surface border border-outline-variant rounded-none py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-surface border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">NAME</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">EMAIL</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">ROLE</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">CREATED DATE</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((item) => {
                  const itemUserId = item._id || item.id;
                  const isSelf = currentUser?.id === itemUserId || currentUser?._id === itemUserId;
                  return (
                    <tr key={itemUserId} className="h-16 hover:bg-surface-container-lowest transition-colors border-b border-outline-variant">
                      <td className="px-6 lg:px-8 py-3">
                        <p className="font-body-lg text-on-surface flex items-center gap-2">
                          {item.name}
                          {isSelf && (
                            <span className="text-[9px] border border-primary/40 px-1 py-0.5 text-primary tracking-widest uppercase font-bold bg-primary/5">YOU</span>
                          )}
                        </p>
                      </td>
                      <td className="px-6 lg:px-8 py-3 font-data-mono text-[11px] tracking-wider text-on-surface-variant uppercase">
                        {item.email}
                      </td>
                      <td className="px-6 lg:px-8">
                        <span className={`px-3 py-1 border text-[10px] font-bold tracking-widest uppercase ${
                          item.role === UserRole.ADMIN ? 'border-primary text-primary bg-primary/5' : 'border-outline text-on-surface-variant bg-surface-container'
                        }`}>
                          {item.role === UserRole.ADMIN ? 'ADMIN' : 'SALES USER'}
                        </span>
                      </td>
                      <td className="px-6 lg:px-8 font-data-mono text-on-surface">
                        {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : 'UNKNOWN'}
                      </td>
                      <td className="px-6 lg:px-8 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setSelectedUser(item);
                              setEditRoleValue(item.role);
                              setIsEditRoleOpen(true);
                            }}
                            disabled={isSelf}
                            className={`p-2 transition-colors ${isSelf ? 'text-outline-variant cursor-not-allowed opacity-35' : 'text-outline hover:text-primary'}`}
                            title={isSelf ? "Cannot edit your own role" : "Change User Role"}
                          >
                            <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(item)}
                            disabled={isSelf}
                            className={`p-2 transition-colors ${isSelf ? 'text-outline-variant cursor-not-allowed opacity-35' : 'text-outline hover:text-error'}`}
                            title={isSelf ? "Cannot delete your own profile" : "Delete User"}
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">group_off</span>
                    <p className="font-headline-md text-on-surface">EMPTY PERSONNEL DECK</p>
                    <p className="font-body-md text-on-surface-variant max-w-sm mx-auto mt-2">No active users matching the search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Personnel Modal */}
      {isOnboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-surface border border-outline-variant w-full max-w-md shadow-2xl relative">
            <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
              <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">
                ONBOARD NEW PERSONNEL
              </h2>
              <button 
                onClick={() => setIsOnboardOpen(false)} 
                className="text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="p-8 space-y-6">
              <div>
                <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name..."
                  className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                  value={onboardForm.name}
                  onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email..."
                  className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                  value={onboardForm.email}
                  onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">SECRET PASSPHRASE</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters..."
                  className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                  value={onboardForm.password}
                  onChange={(e) => setOnboardForm({ ...onboardForm, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">ACCESS DECK ROLE</label>
                <div className="relative">
                  <select
                    className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    value={onboardForm.role}
                    onChange={(e) => setOnboardForm({ ...onboardForm, role: e.target.value as UserRole })}
                  >
                    <option value={UserRole.SALES}>Sales User</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsOnboardOpen(false)}
                  className="flex-1 border border-outline py-3 font-label-sm uppercase text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary border border-primary text-on-primary py-3 font-label-sm uppercase hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50"
                >
                  {submitting ? 'ONBOARDING...' : 'ONBOARD PERSONNEL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditRoleOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-surface border border-outline-variant w-full max-w-md shadow-2xl relative">
            <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
              <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">
                UPDATE PERMISSIONS
              </h2>
              <button 
                onClick={() => {
                  setIsEditRoleOpen(false);
                  setSelectedUser(null);
                }} 
                className="text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleEditRoleSubmit} className="p-8 space-y-6">
              <div>
                <span className="block font-label-sm text-[10px] tracking-widest uppercase text-outline mb-1">USER</span>
                <p className="font-body-lg text-on-surface">{selectedUser.name}</p>
                <p className="font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">ASSIGN DECK ROLE</label>
                <div className="relative">
                  <select
                    className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    value={editRoleValue}
                    onChange={(e) => setEditRoleValue(e.target.value as UserRole)}
                  >
                    <option value={UserRole.SALES}>Sales User</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditRoleOpen(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 border border-outline py-3 font-label-sm uppercase text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary border border-primary text-on-primary py-3 font-label-sm uppercase hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50"
                >
                  {submitting ? 'UPDATING...' : 'UPDATE PERMISSIONS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
