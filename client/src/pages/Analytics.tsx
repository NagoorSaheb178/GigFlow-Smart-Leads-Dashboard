import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lead, LeadStatus } from '../types';
import toast from 'react-hot-toast';
import { format, subMonths, isSameMonth } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [heroStats, setHeroStats] = useState({
    conversion: '0.0%',
    leadsCount: '0',
    engagementRate: '0%',
  });
  
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await api.get('/leads', { params: { limit: 1000 } });
        const leads: Lead[] = response.data.leads || [];
        
        const total = leads.length;
        setTotalLeads(total);

        // 1. Calculate Hero Stats
        const qualifiedCount = leads.filter(l => l.status === LeadStatus.QUALIFIED).length;
        const lostCount = leads.filter(l => l.status === LeadStatus.LOST).length;
        
        const conversion = total > 0 ? ((qualifiedCount / total) * 100).toFixed(1) : '0.0';
        const engagement = total > 0 ? (((total - lostCount) / total) * 100).toFixed(0) : '0';
        
        setHeroStats({
          conversion: `${conversion}%`,
          leadsCount: `${total}`,
          engagementRate: `${engagement}%`,
        });

        // 2. Aggregate Growth Trajectory (Last 6 Months)
        const last6Months = Array.from({ length: 6 }).map((_, i) => {
          return subMonths(new Date(), 5 - i);
        });

        const growthTrajectory = last6Months.map(monthDate => {
          const monthName = format(monthDate, 'MMM');
          const monthLeads = leads.filter(lead => isSameMonth(new Date(lead.createdAt), monthDate));
          
          const leadsCount = monthLeads.length;
          const qualifiedLeadsCount = monthLeads.filter(l => l.status === LeadStatus.QUALIFIED).length;
          const projectedRevenue = qualifiedLeadsCount * 2500; // $2,500 projected value per qualified client

          return {
            name: monthName,
            leads: leadsCount,
            qualified: qualifiedLeadsCount,
            revenue: projectedRevenue
          };
        });

        setMonthlyData(growthTrajectory);

        // 3. Dynamic Channel Intelligence (Sources)
        const sources = leads.reduce((acc, lead) => {
          const src = lead.source || 'Website';
          acc[src] = (acc[src] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const sourceAttribution = Object.entries(sources).map(([name, value]) => ({
          name: name.toUpperCase(),
          value
        }));

        setSourceData(sourceAttribution);

      } catch (error) {
        toast.error('Failed to aggregate real-time analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
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
    <div className="max-w-[1400px] mx-auto flex flex-col gap-gutter">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="font-headline-md text-headline-md tracking-tight uppercase text-on-surface">INTELLIGENCE STUDIO</h1>
          <p className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant mt-2">Deep dive into your sales performance metrics.</p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-2">
        {[
          { label: 'AVG. CONVERSION', value: heroStats.conversion, trend: 'REAL-TIME DATA', icon: 'target' },
          { label: 'TOTAL LEADS VOLUME', value: heroStats.leadsCount, trend: 'SYSTEM METRIC', icon: 'monitoring' },
          { label: 'ACTIVE ENGAGEMENT', value: heroStats.engagementRate, trend: 'NON-LOST RATE', icon: 'bolt' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface border border-outline-variant p-6 lg:p-8 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant">{stat.label}</span>
              <span className="material-symbols-outlined text-outline-variant text-[24px] group-hover:text-primary transition-colors">{stat.icon}</span>
            </div>
            <div className="flex items-baseline justify-between mt-auto">
              <span className="font-display text-[40px] font-semibold text-on-surface">{stat.value}</span>
              <div className="flex items-center gap-1 font-data-mono text-primary text-[10px] tracking-wider font-bold">
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-2">
        {/* Trend Chart */}
        <div className="bg-surface border border-outline-variant p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface">GROWTH TRAJECTORY</h3>
              <p className="font-label-sm text-[10px] uppercase text-on-surface-variant mt-1 tracking-widest">Lead volume vs Qualified leads</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                <div className="w-2 h-2 bg-on-surface"></div>
                LEADS
              </div>
              <div className="flex items-center gap-2 font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                <div className="w-2 h-2 bg-outline-variant"></div>
                QUALIFIED
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--on-surface)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--on-surface)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--outline-variant)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--outline-variant)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10, fontFamily: 'Inter'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10, fontFamily: 'Inter'}} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: '0' }}
                   itemStyle={{ color: 'var(--on-surface)', fontSize: '12px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                   labelStyle={{ color: 'var(--outline)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="leads" stroke="var(--on-surface)" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="qualified" stroke="var(--outline-variant)" strokeWidth={2} fillOpacity={1} fill="url(#colorQualified)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-surface border border-outline-variant p-6 lg:p-8">
          <div className="mb-8">
            <h3 className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface">CHANNEL INTELLIGENCE</h3>
            <p className="font-label-sm text-[10px] uppercase text-on-surface-variant mt-1 tracking-widest">Lead attribution by source</p>
          </div>
          <div className="h-[300px] flex items-center justify-center relative">
            {sourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: '0' }}
                    itemStyle={{ color: 'var(--on-surface)', fontSize: '12px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-on-surface-variant font-label-sm text-[10px] tracking-widest uppercase">No attribution channels found</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
              <span className="text-3xl font-display font-semibold text-on-surface">{totalLeads}</span>
              <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest">TOTAL LEADS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 mb-6">
        <div className="bg-surface border border-outline-variant p-6 lg:p-8">
          <div className="mb-8">
            <h3 className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface">REVENUE IMPACT</h3>
            <p className="font-label-sm text-[10px] uppercase text-on-surface-variant mt-1 tracking-widest">Projected revenue based on qualified leads ($2.5k / Lead)</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10, fontFamily: 'Inter'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10, fontFamily: 'Inter'}} />
                <Tooltip 
                  cursor={{fill: 'var(--surface-container-low)'}}
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: '0' }}
                  itemStyle={{ color: 'var(--on-surface)', fontSize: '12px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  labelStyle={{ color: 'var(--outline)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
                />
                <Bar dataKey="revenue" fill="var(--on-surface)" radius={[0, 0, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
