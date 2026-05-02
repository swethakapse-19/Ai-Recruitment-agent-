import { useApp } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, AreaChart, Area, CartesianGrid, Legend,
} from 'recharts';

const SCORE_DIST = [
  { range: '0-40', count: 1, fill: '#f43f5e' },
  { range: '41-60', count: 2, fill: '#f59e0b' },
  { range: '61-70', count: 3, fill: '#f59e0b' },
  { range: '71-80', count: 4, fill: '#06b6d4' },
  { range: '81-90', count: 5, fill: '#10b981' },
  { range: '91-100', count: 2, fill: '#10b981' },
];

const SKILLS_DEMAND = [
  { skill: 'Python', demand: 95 }, { skill: 'React', demand: 88 },
  { skill: 'ML', demand: 82 }, { skill: 'Docker', demand: 78 },
  { skill: 'TypeScript', demand: 74 }, { skill: 'AWS', demand: 70 },
  { skill: 'FastAPI', demand: 65 }, { skill: 'GraphQL', demand: 58 },
];

const MONTHLY_DATA = [
  { month: 'Jan', applications: 22, interviews: 8, hires: 3 },
  { month: 'Feb', applications: 28, interviews: 12, hires: 5 },
  { month: 'Mar', applications: 35, interviews: 15, hires: 6 },
  { month: 'Apr', applications: 48, interviews: 20, hires: 8 },
  { month: 'May', applications: 42, interviews: 18, hires: 7 },
];

const TOP_MISSING = [
  { skill: 'Kubernetes', count: 8 }, { skill: 'GraphQL', count: 7 },
  { skill: 'LLMs', count: 6 }, { skill: 'Kafka', count: 5 },
  { skill: 'GCP', count: 4 }, { skill: 'Computer Vision', count: 4 },
];

const FUNNEL_DATA = [
  { stage: 'Applied', count: 48, percent: 100, fill: '#7c3aed' },
  { stage: 'Screened', count: 32, percent: 67, fill: '#8b5cf6' },
  { stage: 'Matched (>60%)', count: 20, percent: 42, fill: '#06b6d4' },
  { stage: 'Interviewed', count: 12, percent: 25, fill: '#10b981' },
  { stage: 'Shortlisted', count: 7, percent: 15, fill: '#f59e0b' },
  { stage: 'Hired', count: 3, percent: 6, fill: '#f43f5e' },
];

const FIT_DATA = [
  { name: 'High Fit', value: 7, color: '#10b981' },
  { name: 'Medium Fit', value: 4, color: '#f59e0b' },
  { name: 'Low Fit', value: 1, color: '#f43f5e' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-800/95 border border-white/10 rounded-xl px-3 py-2 text-xs backdrop-blur">
      <div className="text-white/60 mb-1">{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color || p.fill }}>{p.name || p.dataKey}: {p.value}</div>)}
    </div>
  );
};

export default function Analytics() {
  const { candidates } = useApp();

  const totalApps = 48;
  const interviewRate = Math.round((12 / totalApps) * 100);
  const hireRate = Math.round((3 / totalApps) * 100);
  const avgScore = candidates?.length ? Math.round(candidates.reduce((a, c) => a + c.matchScore, 0) / candidates.length) : 0;

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Analytics & Insights</h1>
        <p className="text-white/40 text-sm mt-1">Deep-dive into your hiring pipeline performance.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: 48, sub: 'This month', color: 'bg-violet-500/10 border-violet-500/20 text-violet-400' },
          { label: 'Interview Rate', value: `${interviewRate}%`, sub: '12 interviewed', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
          { label: 'Hire Rate', value: `${hireRate}%`, sub: '3 hired', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
          { label: 'Avg Match Score', value: `${avgScore}%`, sub: 'Across all candidates', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className={`glass p-4 border ${color.split(' ')[1]}`}>
            <div className={`text-2xl font-black ${color.split(' ')[2]} mb-1`}>{value}</div>
            <div className="text-sm font-medium text-white/70">{label}</div>
            <div className="text-xs text-white/30 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Hiring Funnel + Fit Dist */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 glass p-5">
          <h2 className="font-bold text-white mb-4">Hiring Funnel</h2>
          <div className="space-y-3">
            {FUNNEL_DATA.map(item => (
              <div key={item.stage}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/70">{item.stage}</span>
                  <span className="font-bold text-white">{item.count} <span className="text-white/30 font-normal text-xs">({item.percent}%)</span></span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${item.percent}%`, background: item.fill }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="text-xs text-white/30">Conversion: Applied → Hired = <span className="text-white font-semibold">6%</span> · Avg Time-to-Hire: <span className="text-white font-semibold">12 days</span></div>
          </div>
        </div>

        <div className="glass p-5">
          <h2 className="font-bold text-white mb-4">Fit Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={FIT_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {FIT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {FIT_DATA.map(item => (
              <div key={item.name} className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-white/60">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="glass p-5">
          <h2 className="font-bold text-white mb-4">Monthly Pipeline Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                {[['apps', '#7c3aed'], ['int', '#06b6d4'], ['hire', '#10b981']].map(([id, color]) => (
                  <linearGradient key={id} id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }} />
              <Area type="monotone" dataKey="applications" stroke="#7c3aed" strokeWidth={2} fill="url(#g-apps)" name="Applications" />
              <Area type="monotone" dataKey="interviews" stroke="#06b6d4" strokeWidth={2} fill="url(#g-int)" name="Interviews" />
              <Area type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={2} fill="url(#g-hire)" name="Hires" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Score distribution */}
        <div className="glass p-5">
          <h2 className="font-bold text-white mb-4">Score Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SCORE_DIST} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                {SCORE_DIST.map((entry, i) => <Cell key={i} fill={entry.fill} opacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill demand + Missing */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass p-5">
          <h2 className="font-bold text-white mb-4">Skill Demand Trends</h2>
          <div className="space-y-3">
            {SKILLS_DEMAND.map(item => (
              <div key={item.skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">{item.skill}</span>
                  <span className="font-bold text-white">{item.demand}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-gradient-to-r from-violet-500 to-cyan-500" style={{ width: `${item.demand}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-5">
          <h2 className="font-bold text-white mb-1">Top Missing Skills</h2>
          <p className="text-xs text-white/40 mb-4">Most common skill gaps across all candidates</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_MISSING} layout="vertical" barSize={16}>
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="skill" type="category" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Candidates Missing" fill="#f43f5e" radius={[0, 6, 6, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-rose-500/8 border border-rose-500/15 rounded-xl">
            <div className="text-xs text-rose-400 font-medium">💡 Insight</div>
            <div className="text-xs text-white/50 mt-1">Kubernetes and GraphQL are the most critical gaps. Consider JD simplification or upskilling programs.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
