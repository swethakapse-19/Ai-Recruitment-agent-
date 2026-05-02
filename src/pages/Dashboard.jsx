import { Link } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Clock, TrendingUp, Upload, Plus, ArrowRight, Brain, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { CANDIDATE_STATS } from '../data/mockCandidates';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const FUNNEL_DATA = [
  { stage: 'Applied', count: 48, fill: '#7c3aed' },
  { stage: 'Screened', count: 32, fill: '#8b5cf6' },
  { stage: 'Matched', count: 20, fill: '#06b6d4' },
  { stage: 'Interviewed', count: 12, fill: '#10b981' },
  { stage: 'Shortlisted', count: 7, fill: '#f59e0b' },
];

const SCORE_DIST = [
  { range: '0-40', count: 2 }, { range: '41-60', count: 3 },
  { range: '61-70', count: 3 }, { range: '71-80', count: 4 },
  { range: '81-90', count: 5 }, { range: '91-100', count: 2 },
];

const TREND_DATA = [
  { month: 'Jan', hires: 4, applications: 22 },
  { month: 'Feb', hires: 6, applications: 28 },
  { month: 'Mar', hires: 5, applications: 35 },
  { month: 'Apr', hires: 8, applications: 48 },
  { month: 'May', hires: 7, applications: 42 },
];

const FIT_PIE = [
  { name: 'High Fit', value: 7, color: '#10b981' },
  { name: 'Medium Fit', value: 4, color: '#f59e0b' },
  { name: 'Low Fit', value: 1, color: '#f43f5e' },
];

const ACTIVITY_ICONS = {
  shortlist: CheckCircle,
  upload: Upload,
  interview: Brain,
  reject: XCircle,
  info: Zap,
};
const ACTIVITY_COLORS = {
  shortlist: 'text-emerald-400', upload: 'text-violet-400',
  interview: 'text-cyan-400', reject: 'text-rose-400', info: 'text-amber-400',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-800/95 border border-white/10 rounded-xl px-3 py-2 text-xs">
      <div className="text-white/60 mb-1">{label}</div>
      {payload.map(p => <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

export default function Dashboard() {
  const { candidates, activityLog, jobs } = useApp();
  const { user } = useAuth();
  const stats = CANDIDATE_STATS;

  const topCandidates = [...(candidates || [])].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0] || 'Recruiter'}</span> 👋
          </h1>
          <p className="text-white/40 mt-1 text-sm">Here's your hiring pipeline overview for today.</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2 hidden md:flex">
          <Plus size={16} /> New Analysis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Candidates" value={candidates?.length || 0} subtitle="This month" icon={Users} color="violet" trend={12} />
        <StatCard title="Shortlisted" value={candidates?.filter(c => c.status === 'Shortlisted').length || 0} subtitle="Ready for interview" icon={CheckCircle} color="emerald" trend={8} />
        <StatCard title="Under Review" value={candidates?.filter(c => c.status === 'Under Review').length || 0} subtitle="Pending analysis" icon={Clock} color="amber" />
        <StatCard title="Avg Match Score" value={`${stats.avgScore}%`} subtitle="Above industry avg" icon={TrendingUp} color="cyan" trend={5} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Funnel */}
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Hiring Funnel</h2>
            <span className="badge-violet text-[10px]">Live</span>
          </div>
          <div className="space-y-2">
            {FUNNEL_DATA.map((item, i) => (
              <div key={item.stage}>
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>{item.stage}</span><span className="font-semibold text-white">{item.count}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(item.count / 48) * 100}%`, background: item.fill }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend chart */}
        <div className="glass p-5">
          <h2 className="font-bold text-white mb-5">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="applications" stroke="#7c3aed" strokeWidth={2} fill="url(#colorApps)" name="Applications" />
              <Area type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={2} fill="url(#colorHires)" name="Hires" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fit distribution */}
        <div className="glass p-5">
          <h2 className="font-bold text-white mb-5">Fit Distribution</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={FIT_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {FIT_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {FIT_PIE.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-white/50">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Candidates */}
        <div className="lg:col-span-2 glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Top Candidates</h2>
            <Link to="/candidates" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {topCandidates.map(c => (
              <Link key={c.id} to={`/candidate/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{c.name}</div>
                  <div className="text-xs text-white/40">{c.role} · {c.experience}y exp</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-white">{c.matchScore}%</div>
                  <div className={`text-[10px] font-semibold ${c.fitLevel === 'High' ? 'text-emerald-400' : c.fitLevel === 'Medium' ? 'text-amber-400' : 'text-rose-400'}`}>
                    {c.fitLevel} Fit
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === 'Shortlisted' ? 'bg-emerald-400' : c.status === 'Rejected' ? 'bg-rose-400' : 'bg-amber-400'}`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="glass p-5">
          <h2 className="font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activityLog.slice(0, 5).map(item => {
              const Icon = ACTIVITY_ICONS[item.type] || Zap;
              const color = ACTIVITY_COLORS[item.type] || 'text-white/60';
              return (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className={`mt-0.5 flex-shrink-0 ${color}`}><Icon size={13} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/70 leading-relaxed">{item.action}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Jobs */}
          <div className="divider" />
          <h3 className="text-sm font-semibold text-white/70 mb-3">Active Jobs</h3>
          <div className="space-y-2">
            {jobs.slice(0, 3).map(job => (
              <div key={job.id} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-white">{job.title}</div>
                  <div className="text-[10px] text-white/30">{job.candidates} candidates</div>
                </div>
                <span className={`badge text-[10px] ${job.status === 'Active' ? 'badge-emerald' : 'badge-amber'}`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
