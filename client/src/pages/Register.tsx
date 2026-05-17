import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { UserRole } from '../types';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.SALES,
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      login(response.data.token, response.data.user);
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-surface border border-outline-variant p-6 sm:p-10 lg:p-12 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
        
        <div className="mb-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-primary mb-3">person_add</span>
          <h1 className="font-display text-headline-lg text-primary tracking-tight uppercase">REGISTER</h1>
          <p className="font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mt-2">Create your GigFlow Account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">FULL NAME</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">person</span>
              <input
                type="text"
                required
                className="w-full bg-surface border border-outline-variant rounded-none py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">EMAIL ADDRESS</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">mail</span>
              <input
                type="email"
                required
                className="w-full bg-surface border border-outline-variant rounded-none py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">PASSWORD</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">lock</span>
              <input
                type="password"
                required
                className="w-full bg-surface border border-outline-variant rounded-none py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">USER ROLE</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">shield</span>
              <select
                className="w-full bg-surface border border-outline-variant rounded-none py-3 pl-12 pr-10 font-label-sm tracking-widest text-[10px] uppercase text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.SALES}>Sales User</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary border border-primary text-on-primary py-4 font-label-sm uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'REGISTERING...' : 'REGISTER'}
            {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant text-center">
          <p className="font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
