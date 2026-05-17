import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, LeadSource } from '../types';
import api from '../services/api';
import toast from 'react-hot-toast';

interface LeadFormProps {
  lead: Lead | null;
  onClose: () => void;
  onSuccess: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: LeadStatus.NEW,
    source: LeadSource.WEBSITE,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (lead) {
        await api.put(`/leads/${lead._id}`, formData);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/leads', formData);
        toast.success('Lead created successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-surface border border-outline-variant w-full max-w-md shadow-2xl relative">
        <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">
            {lead ? 'EDIT LEAD' : 'ADD NEW LEAD'}
          </h2>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">FULL NAME</label>
            <input
              type="text"
              required
              className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">STATUS</label>
              <div className="relative">
                <select
                  className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                >
                  {Object.values(LeadStatus).map(status => (
                    <option key={status} value={status}>{status.toUpperCase()}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">expand_more</span>
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-[10px] tracking-widest uppercase text-on-surface-variant mb-2">SOURCE</label>
              <div className="relative">
                <select
                  className="w-full bg-surface border border-outline-variant rounded-none py-3 px-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                >
                  {Object.values(LeadSource).map(source => (
                    <option key={source} value={source}>{source.toUpperCase()}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">expand_more</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-outline py-3 font-label-sm uppercase text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary border border-primary text-on-primary py-3 font-label-sm uppercase hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50"
            >
              {loading ? 'SAVING...' : (lead ? 'UPDATE LEAD' : 'SAVE LEAD')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
