import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SortAsc, CheckCircle, XCircle, Clock, ChevronRight, Star, Tag, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SkillBadge from '../components/SkillBadge';

const STATUS_CONFIG = {
  'Shortlisted': { badge: 'badge-emerald', dot: 'bg-emerald-400' },
  'Under Review': { badge: 'badge-amber', dot: 'bg-amber-400' },
  'Rejected': { badge: 'badge-rose', dot: 'bg-rose-400' },
};

const FIT_CONFIG = {
  'High': { color: 'text-emerald-400', bar: 'bg-emerald-500' },
  'Medium': { color: 'text-amber-400', bar: 'bg-amber-500' },
  'Low': { color: 'text-rose-400', bar: 'bg-rose-500' },
};

export default function Candidates() {
  const { candidates, updateCandidateStatus } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterFit, setFilterFit] = useState('All');
  const [filterDomain, setFilterDomain] = useState('All');
  const [sortBy, setSortBy] = useState('matchScore');
  const [sortDir, setSortDir] = useState('desc');
  const [minScore, setMinScore] = useState(0);
  const [selected, setSelected] = useState(new Set());

  const domains = ['All', ...new Set((candidates || []).map(c => c.domain).filter(Boolean))];

  const filtered = useMemo(() => {
    let list = candidates || [];
    if (search) list = list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role?.toLowerCase().includes(search.toLowerCase()) ||
      c.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
    if (filterStatus !== 'All') list = list.filter(c => c.status === filterStatus);
    if (filterFit !== 'All') list = list.filter(c => c.fitLevel === filterFit);
    if (filterDomain !== 'All') list = list.filter(c => c.domain === filterDomain);
    if (minScore > 0) list = list.filter(c => c.matchScore >= minScore);
    list = [...list].sort((a, b) => {
      const valA = a[sortBy] ?? 0;
      const valB = b[sortBy] ?? 0;
      return sortDir === 'desc' ? valB - valA : valA - valB;
    });
    return list;
  }, [candidates, search, filterStatus, filterFit, filterDomain, sortBy, sortDir, minScore]);

  const toggleSelect = (id) => setSelected(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const bulkAction = (status) => {
    selected.forEach(id => updateCandidateStatus(id, status));
    setSelected(new Set());
  };

  const exportCSV = () => {
    const rows = [['Name', 'Role', 'Experience', 'Match Score', 'Fit Level', 'Status']];
    filtered.forEach(c => rows.push([c.name, c.role, c.experience, c.matchScore, c.fitLevel, c.status]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'candidates.csv'; a.click();
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Candidates</h1>
          <p className="text-white/40 text-sm mt-1">{filtered.length} of {candidates?.length || 0} candidates</p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <>
              <button onClick={() => bulkAction('Shortlisted')} className="btn-success text-xs">Shortlist ({selected.size})</button>
              <button onClick={() => bulkAction('Rejected')} className="btn-danger text-xs">Reject ({selected.size})</button>
            </>
          )}
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-4 mb-5">
        <div className="grid md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates, roles, skills..."
              className="input-field pl-9 text-sm py-2.5" />
          </div>
          {[
            { label: 'Status', value: filterStatus, set: setFilterStatus, opts: ['All', 'Shortlisted', 'Under Review', 'Rejected'] },
            { label: 'Fit Level', value: filterFit, set: setFilterFit, opts: ['All', 'High', 'Medium', 'Low'] },
            { label: 'Domain', value: filterDomain, set: setFilterDomain, opts: domains },
            { label: 'Sort By', value: sortBy, set: setSortBy, opts: [{ v: 'matchScore', l: 'Match Score' }, { v: 'resumeScore', l: 'Resume Score' }, { v: 'experience', l: 'Experience' }, { v: 'atsScore', l: 'ATS Score' }] },
          ].map(({ label, value, set, opts }) => (
            <select key={label} value={value} onChange={e => set(e.target.value)}
              className="input-field text-sm py-2.5 cursor-pointer">
              {opts.map(o => typeof o === 'object' ? <option key={o.v} value={o.v}>{o.l}</option> : <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <label className="text-xs text-white/40">Min Score: <span className="text-white font-semibold">{minScore}%</span></label>
          <input type="range" min="0" max="100" step="10" value={minScore} onChange={e => setMinScore(+e.target.value)}
            className="flex-1 accent-violet-500 max-w-xs" />
          <button onClick={() => { setSearch(''); setFilterStatus('All'); setFilterFit('All'); setFilterDomain('All'); setSortBy('matchScore'); setMinScore(0); }}
            className="text-xs text-white/30 hover:text-white/60">Reset</button>
        </div>
      </div>

      {/* Candidate cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass p-12 text-center text-white/30 text-sm">No candidates match your filters.</div>
        )}
        {filtered.map(c => {
          const fit = FIT_CONFIG[c.fitLevel] || FIT_CONFIG.Medium;
          const status = STATUS_CONFIG[c.status] || STATUS_CONFIG['Under Review'];
          const isSelected = selected.has(c.id);

          return (
            <div key={c.id}
              className={`glass-hover p-4 flex items-center gap-4 transition-all cursor-pointer ${isSelected ? 'border-violet-500/40 bg-violet-500/8' : ''}`}
              onClick={() => toggleSelect(c.id)}>
              {/* Checkbox */}
              <div onClick={e => { e.stopPropagation(); toggleSelect(c.id); }}
                className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-violet-500 border-violet-500' : 'border-white/20'}`}>
                {isSelected && <CheckCircle size={12} className="text-white" />}
              </div>

              {/* Avatar */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 flex items-center justify-center text-base font-bold text-white flex-shrink-0">
                {c.name[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Link to={`/candidate/${c.id}`} onClick={e => e.stopPropagation()} className="text-sm font-bold text-white hover:text-violet-300 transition-colors">
                    {c.name}
                  </Link>
                  {c.tags?.includes('Top Candidate') && <Star size={11} className="text-amber-400 fill-amber-400" />}
                </div>
                <div className="text-xs text-white/40">{c.role} · {c.experience}y · {c.location || 'India'}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.skills?.slice(0, 4).map(s => <SkillBadge key={s} skill={s} size="xs" />)}
                  {c.skills?.length > 4 && <span className="text-[10px] text-white/30 self-center">+{c.skills.length - 4}</span>}
                </div>
              </div>

              {/* Scores */}
              <div className="hidden md:flex gap-5 flex-shrink-0">
                {[
                  { label: 'Match', value: c.matchScore },
                  { label: 'ATS', value: c.atsScore },
                  { label: 'Resume', value: c.resumeScore },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-base font-bold text-white">{value}%</div>
                    <div className="text-[10px] text-white/30">{label}</div>
                  </div>
                ))}
              </div>

              {/* Fit */}
              <div className="flex-shrink-0 text-center hidden lg:block">
                <div className={`text-sm font-bold ${fit.color}`}>{c.fitLevel}</div>
                <div className="text-[10px] text-white/30">Fit</div>
              </div>

              {/* Status */}
              <div className="flex-shrink-0">
                <span className={`badge text-[10px] ${status.badge}`}>{c.status}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <button onClick={() => updateCandidateStatus(c.id, 'Shortlisted')}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all" title="Shortlist">
                  <CheckCircle size={13} />
                </button>
                <button onClick={() => updateCandidateStatus(c.id, 'Rejected')}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all" title="Reject">
                  <XCircle size={13} />
                </button>
                <Link to={`/candidate/${c.id}`}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-all">
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
