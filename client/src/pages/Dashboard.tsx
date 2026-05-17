import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lead, LeadStatus } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    qualified: 0,
    lost: 0,
    conversion: 0
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [sourceData, setSourceData] = useState<{name: string, value: number}[]>([]);
  const [growthData, setGrowthData] = useState<{date: string, leads: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/leads', { params: { limit: 100 } }); // Fetch more for stats
        const leads: Lead[] = response.data.leads || [];
        
        const total = leads.length;
        const qualified = leads.filter(l => l.status === LeadStatus.QUALIFIED).length;
        const lost = leads.filter(l => l.status === LeadStatus.LOST).length;
        const conversion = total > 0 ? ((qualified / total) * 100).toFixed(1) : '0.0';

        setStats({ total, qualified, lost, conversion: parseFloat(conversion) });
        
        // Sort leads by latest first, grab top 5
        const sortedLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentLeads(sortedLeads.slice(0, 5));

        // Source Distribution Data
        const sources = leads.reduce((acc, lead) => {
          acc[lead.source] = (acc[lead.source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        setSourceData(Object.entries(sources).map(([name, value]) => ({ name, value })));

        // Growth Data (last 7 days)
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return format(d, 'MMM dd');
        });

        const growthMap = leads.reduce((acc, lead) => {
          const dateStr = format(new Date(lead.createdAt), 'MMM dd');
          acc[dateStr] = (acc[dateStr] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        let cumulative = 0;
        setGrowthData(last7Days.map(date => {
          cumulative += (growthMap[date] || 0);
          return { date, leads: cumulative };
        }));

      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const PIE_COLORS = ['var(--on-surface)', 'var(--outline-variant)', 'var(--surface-tint)', 'var(--on-surface-variant)'];

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-gutter">
      {/* KPI Section */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-6">
        <div className="bg-surface border border-outline-variant p-6 lg:p-8 flex flex-col justify-between min-h-[140px]">
          <span className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant">TOTAL LEADS</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[40px] font-semibold text-on-surface">{stats.total}</span>
          </div>
        </div>
        <div className="bg-surface border border-outline-variant p-6 lg:p-8 flex flex-col justify-between min-h-[140px]">
          <span className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant">QUALIFIED</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[40px] font-semibold text-primary">{stats.qualified}</span>
          </div>
        </div>
        <div className="bg-surface border border-outline-variant p-6 lg:p-8 flex flex-col justify-between min-h-[140px]">
          <span className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant">LOST LEADS</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[40px] font-semibold text-error">{stats.lost}</span>
          </div>
        </div>
        <div className="bg-surface border border-outline-variant p-6 lg:p-8 flex flex-col justify-between min-h-[140px]">
          <span className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant">CONVERSION</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[40px] font-semibold text-secondary">{stats.conversion}%</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-6">
        <div className="bg-surface border border-outline-variant p-6 lg:p-8">
          <h2 className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant mb-6">LEADS BY SOURCE</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                  className="font-label-sm text-[10px] tracking-widest uppercase fill-on-surface"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: '0' }}
                  itemStyle={{ color: 'var(--on-surface)', fontSize: '12px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-surface border border-outline-variant p-6 lg:p-8">
          <h2 className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant mb-6">LEADS GROWTH (7 DAYS)</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--on-surface-variant)', fontFamily: 'Inter' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--on-surface-variant)', fontFamily: 'Inter' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: '0' }}
                  labelStyle={{ color: 'var(--outline)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
                  itemStyle={{ color: 'var(--on-surface)', fontSize: '12px', fontFamily: 'Inter' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="var(--on-surface)" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: 'var(--on-surface)', strokeWidth: 0 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="col-span-12 bg-surface border border-outline-variant p-0 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
          <h2 className="font-headline-md text-headline-md tracking-tight uppercase">RECENT LEADS</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">NAME</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">EMAIL</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">STATUS</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">SOURCE</th>
                <th className="py-4 px-6 lg:px-8 font-label-sm text-label-sm tracking-widest uppercase border-b border-outline-variant">CREATED DATE</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead._id} className="h-16 hover:bg-surface-container-lowest transition-colors border-b border-outline-variant">
                  <td className="px-6 lg:px-8 font-body-lg text-on-surface">{lead.name}</td>
                  <td className="px-6 lg:px-8 font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase">{lead.email}</td>
                  <td className="px-6 lg:px-8">
                    <span className={`px-3 py-1 border text-[10px] font-bold tracking-widest uppercase ${
                      lead.status === LeadStatus.QUALIFIED ? 'border-primary text-primary' :
                      lead.status === LeadStatus.LOST ? 'border-error text-error' :
                      'border-outline text-on-surface-variant'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 lg:px-8 text-on-surface-variant font-label-sm uppercase">{lead.source}</td>
                  <td className="px-6 lg:px-8 font-data-mono text-on-surface">{format(new Date(lead.createdAt), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr className="h-16">
                  <td colSpan={5} className="px-8 text-center text-on-surface-variant font-body-md py-8">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

