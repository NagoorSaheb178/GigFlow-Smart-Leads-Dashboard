import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Lead, LeadsResponse, LeadStatus, LeadSource, UserRole } from '../types';
import LeadForm from '../components/LeadForm';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Leads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('latest');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<LeadsResponse>('/leads', {
        params: {
          page,
          search: debouncedSearch,
          status: statusFilter,
          source: sourceFilter,
          sort: sortOrder
        },
      });
      setLeads(response.data.leads);
      setTotalPages(response.data.pagination.pages);
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, sourceFilter, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted successfully');
        if (leads.length === 1 && page > 1) {
          setPage(p => p - 1);
        } else {
          fetchLeads();
        }
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-gutter">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="font-headline-md text-headline-md tracking-tight uppercase text-on-surface">LEADS INVENTORY</h1>
          <p className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant mt-2">Manage and monitor prospective clients.</p>
        </div>
        <div className="flex items-center gap-4">
          {user?.role === UserRole.ADMIN && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 font-label-sm text-label-sm border border-outline px-6 py-2 hover:bg-surface-container-high transition-colors uppercase text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              EXPORT CSV
            </button>
          )}
          <button
            onClick={() => {
              setEditingLead(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 font-label-sm text-label-sm border border-primary px-6 py-2 bg-primary text-on-primary hover:bg-on-surface transition-colors uppercase"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            ADD LEAD
          </button>
        </div>
      </div>

      <div className="bg-surface border border-outline-variant overflow-hidden">
        {/* Filters Area */}
        <div className="p-6 lg:p-8 border-b border-outline-variant bg-surface-bright flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-surface border border-outline-variant rounded-none py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">filter_list</span>
              <select
                className="bg-surface border border-outline-variant rounded-none py-3 pl-10 pr-8 font-label-sm text-label-sm uppercase tracking-widest text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">ALL STATUS</option>
                {Object.values(LeadStatus).map(status => (
                  <option key={status} value={status}>{status.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">public</span>
              <select
                className="bg-surface border border-outline-variant rounded-none py-3 pl-10 pr-8 font-label-sm text-label-sm uppercase tracking-widest text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                value={sourceFilter}
                onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
              >
                <option value="">ALL SOURCES</option>
                {Object.values(LeadSource).map(source => (
                  <option key={source} value={source}>{source.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">sort</span>
              <select
                className="bg-surface border border-outline-variant rounded-none py-3 pl-10 pr-8 font-label-sm text-label-sm uppercase tracking-widest text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
              >
                <option value="latest">LATEST FIRST</option>
                <option value="oldest">OLDEST FIRST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">NAME & EMAIL</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">STATUS</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">SOURCE</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">CREATED AT</th>
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
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="h-16 hover:bg-surface-container-lowest transition-colors border-b border-outline-variant">
                    <td className="px-6 lg:px-8 py-3">
                      <p className="font-body-lg text-on-surface">{lead.name}</p>
                      <p className="font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase">{lead.email}</p>
                    </td>
                    <td className="px-6 lg:px-8">
                      <span className={`px-3 py-1 border text-[10px] font-bold tracking-widest uppercase ${
                        lead.status === LeadStatus.QUALIFIED ? 'border-primary text-primary' :
                        lead.status === LeadStatus.LOST ? 'border-error text-error' :
                        'border-outline text-on-surface-variant'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 lg:px-8 text-on-surface-variant font-label-sm uppercase">
                      {lead.source}
                    </td>
                    <td className="px-6 lg:px-8 font-data-mono text-on-surface">
                      {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 lg:px-8 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/leads/${lead._id}`}
                          className="p-2 text-outline hover:text-primary transition-colors"
                          title="View"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </Link>
                        <button
                          onClick={() => {
                            setEditingLead(lead);
                            setIsFormOpen(true);
                          }}
                          className="p-2 text-outline hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        {user?.role === UserRole.ADMIN && (
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="p-2 text-outline hover:text-error transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">inbox</span>
                    <p className="font-headline-md text-on-surface">NO LEADS FOUND</p>
                    <p className="font-body-md text-on-surface-variant max-w-sm mx-auto mt-2">We couldn't find any leads matching your current filters. Try adjusting your search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="p-6 border-t border-outline-variant bg-surface-bright flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant">
              SHOWING <span className="font-data-mono text-primary font-bold">{(page - 1) * 10 + 1}-{Math.min(page * 10, totalRecords)}</span> OF <span className="font-data-mono text-primary font-bold">{totalRecords}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-outline hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-label-sm uppercase flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span> PREV
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-outline hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-label-sm uppercase flex items-center gap-1"
              >
                NEXT <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <LeadForm
          lead={editingLead}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
};

export default Leads;

