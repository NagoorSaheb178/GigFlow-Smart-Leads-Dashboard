import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lead, LeadStatus, UserRole } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import LeadForm from '../components/LeadForm';
import { useAuth } from '../context/AuthContext';

const LeadDetails = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchLead = async () => {
    try {
      const response = await api.get<Lead>(`/leads/${id}`);
      setLead(response.data);
    } catch (error) {
      toast.error('Failed to fetch lead details');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted successfully');
        navigate('/leads');
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-gutter">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div>
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-outline hover:text-on-surface transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            BACK TO INVENTORY
          </button>
          <h1 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">LEAD INTELLIGENCE</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 font-label-sm text-label-sm border border-outline px-6 py-2 hover:bg-surface-container-high transition-colors uppercase text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            UPDATE
          </button>
          {user?.role === UserRole.ADMIN && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 font-label-sm text-label-sm border border-error text-error px-6 py-2 hover:bg-error hover:text-surface transition-colors uppercase"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              REMOVE
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Main Entity Data */}
        <div className="lg:col-span-2 space-y-gutter">
          <div className="bg-surface border border-outline-variant p-8 lg:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant pb-8 mb-8">
              <div>
                <h2 className="font-display text-[48px] font-semibold text-on-surface leading-none mb-2">{lead.name}</h2>
                <p className="font-label-sm text-[12px] tracking-widest uppercase text-on-surface-variant">{lead.email}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-label-sm text-[10px] tracking-widest uppercase text-outline">CURRENT STATUS</span>
                <span className={`px-4 py-2 border text-[12px] font-bold tracking-widest uppercase ${
                  lead.status === LeadStatus.QUALIFIED ? 'border-primary text-primary' : 
                  lead.status === LeadStatus.LOST ? 'border-error text-error' :
                  'border-outline text-on-surface-variant'
                }`}>
                  {lead.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="block font-label-sm text-[10px] tracking-widest uppercase text-outline mb-2">ACQUISITION SOURCE</span>
                <div className="flex items-center gap-2 font-body-md text-on-surface uppercase">
                  <span className="material-symbols-outlined text-[18px] text-primary">public</span>
                  {lead.source}
                </div>
              </div>
              <div>
                <span className="block font-label-sm text-[10px] tracking-widest uppercase text-outline mb-2">REGISTRATION DATE</span>
                <div className="flex items-center gap-2 font-data-mono text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                  {format(new Date(lead.createdAt), 'MMMM dd, yyyy')}
                </div>
              </div>
              <div>
                <span className="block font-label-sm text-[10px] tracking-widest uppercase text-outline mb-2">LEAD ID</span>
                <div className="font-data-mono text-on-surface-variant text-sm">
                  {lead._id}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant p-8 lg:p-12">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant">
              <h3 className="font-label-sm tracking-widest uppercase text-on-surface-variant">STRATEGIC TIMELINE</h3>
              <button className="font-label-sm text-[10px] tracking-widest text-primary uppercase hover:underline">ADD NOTE</button>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div className="w-px h-full bg-outline-variant my-2"></div>
                </div>
                <div className="pb-6">
                  <p className="font-label-sm text-[10px] tracking-widest text-outline mb-1">{format(new Date(lead.createdAt), 'MMM dd, yyyy - HH:mm')}</p>
                  <p className="font-body-md text-on-surface">Lead acquired from {lead.source} and registered in system.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 border border-outline rounded-full"></div>
                </div>
                <div>
                  <p className="font-label-sm text-[10px] tracking-widest text-outline mb-1">AWAITING ACTION</p>
                  <p className="font-body-md text-on-surface-variant italic">No strategic notes have been logged for this entity yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-gutter">
          <div className="bg-primary text-on-primary p-8 lg:p-12 border border-primary relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-on-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <h4 className="font-label-sm text-[10px] uppercase tracking-widest mb-6 opacity-80">CONVERSION PROBABILITY</h4>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-display text-[64px] font-semibold leading-none">84</span>
              <span className="font-data-mono text-[20px] opacity-60">%</span>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between font-label-sm text-[10px] tracking-widest uppercase">
                <span>PRIORITY INDEX</span>
                <span>TIER 1 / HIGH</span>
              </div>
              <div className="h-1 bg-on-primary/20 w-full">
                <div className="h-full bg-on-primary w-[84%]"></div>
              </div>
            </div>
            <p className="font-body-sm text-[12px] opacity-80 leading-relaxed italic">
              Analytics suggest a high likelihood of conversion based on source channel and acquisition velocity.
            </p>
          </div>

          <div className="bg-surface border border-outline-variant p-8">
            <h4 className="font-label-sm text-[10px] uppercase tracking-widest text-outline mb-6">RECOMMENDED ACTIONS</h4>
            <div className="space-y-4">
              {[
                { label: 'INITIATE DIRECT EMAIL', icon: 'mail' },
                { label: 'PROPOSE DIGITAL SYNC', icon: 'video_camera_front' },
                { label: 'REGISTER VOICE OUTREACH', icon: 'phone' },
              ].map((action, idx) => (
                <button 
                  key={idx}
                  className="w-full flex items-center justify-between p-4 border border-outline-variant hover:border-primary hover:bg-surface-container-lowest transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">{action.icon}</span>
                    <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface">{action.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <LeadForm
          lead={lead}
          onClose={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            fetchLead();
          }}
        />
      )}
    </div>
  );
};

export default LeadDetails;
