import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-surface border border-outline-variant p-6 sm:p-10 lg:p-12 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="mb-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-primary mb-3">dataset</span>
          <h1 className="font-display text-headline-lg text-primary tracking-tight uppercase">GIGFLOW</h1>
          <p className="font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mt-2">Welcome to Leads Dashboard</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">EMAIL ADDRESS</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">mail</span>
              <input
                type="email"
                required
                className="w-full bg-surface border border-outline-variant rounded-none py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant">PASSWORD</label>
              <button
                type="button"
                onClick={() => toast('Password recovery system not configured', { icon: '🔑' })}
                className="font-label-sm text-[10px] tracking-widest uppercase text-primary hover:underline focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">lock</span>
              <input
                type="password"
                required
                className="w-full bg-surface border border-outline-variant rounded-none py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary border border-primary text-on-primary py-4 font-label-sm uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
            {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant text-center">
          <p className="font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
