import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Upload, Users, BarChart3, Zap, Shield, Target, ChevronRight, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: Brain, title: 'AI Resume Analysis', desc: 'NLP-powered parsing extracts skills, experience, and calculates ATS compatibility scores instantly.', color: 'violet' },
  { icon: Target, title: 'Smart Job Matching', desc: 'Semantic similarity engine matches candidates to roles with precision skill-gap detection.', color: 'cyan' },
  { icon: Zap, title: 'Interview Intelligence', desc: 'Auto-generates role-specific questions across behavioral, technical, and coding categories.', color: 'amber' },
  { icon: BarChart3, title: 'Analytics & Insights', desc: 'Real-time hiring funnel, skill demand trends, and recruiter performance dashboards.', color: 'emerald' },
  { icon: Shield, title: 'Bias Detection', desc: 'AI scans job descriptions for biased language and suggests inclusive alternatives.', color: 'rose' },
  { icon: Users, title: 'Multi-Agent System', desc: '5 specialized AI agents collaborate — Resume, Matching, Interview, Feedback, and Chat.', color: 'violet' },
];

const STATS = [
  { value: '75+', label: 'Features' },
  { value: '5', label: 'AI Agents' },
  { value: '6', label: 'Core Modules' },
  { value: '100%', label: 'Bias-Free' },
];

const COLOR_MAP = {
  violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
  emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
  rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400',
};

const WORD_CYCLE = ['Smarter', 'Faster', 'Fairer', 'Better'];

export default function Landing() {
  const [wordIndex, setWordIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % WORD_CYCLE.length), 2000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = isSignup ? await signup(name, email, password) : await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen dot-grid">
      {/* Hero */}
      <div className="relative pt-24 pb-20 px-6">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-violet-500/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Hero text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              AI-Powered Recruitment Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
              <span className="text-white">Hire </span>
              <span className="gradient-text transition-all duration-500">{WORD_CYCLE[wordIndex]}</span>
              <br />
              <span className="text-white">with AI</span>
            </h1>
            <p className="text-lg text-white/50 mb-8 leading-relaxed max-w-xl">
              TalentIQ uses a 5-agent AI system to analyze resumes, match candidates, generate interviews, and deliver hiring insights — all in seconds.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 justify-center lg:justify-start mb-10">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black gradient-text">{value}</div>
                  <div className="text-xs text-white/40 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
              <button onClick={() => document.getElementById('auth-panel').scrollIntoView({ behavior: 'smooth' })} className="btn-primary flex items-center gap-2">
                Get Started Free <ArrowRight size={16} />
              </button>
              <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
                View Demo <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right — Auth panel */}
          <div id="auth-panel" className="glass p-8 max-w-md mx-auto w-full">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-violet-500/30">
                <Brain size={22} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-white/40 text-sm mt-1">
                {isSignup ? 'Start your AI hiring journey' : 'Sign in to your dashboard'}
              </p>
            </div>

            {!isSignup && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 mb-4 text-xs text-violet-300">
                <strong>Demo:</strong> admin@talentiq.ai / admin123
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="label">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Swetha Kapse" className="input-field" required />
                </div>
              )}
              <div>
                <label className="label">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="input-field" required />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-field" required />
              </div>
              {error && <div className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</div>}
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> : (isSignup ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <button onClick={() => { setIsSignup(!isSignup); setError(''); }} className="w-full mt-4 text-sm text-white/40 hover:text-white/70 transition-colors">
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">Everything You Need to <span className="gradient-text">Hire Better</span></h2>
            <p className="text-white/40 max-w-xl mx-auto">75+ features organized into 7 core modules, powered by a multi-agent AI architecture.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => {
              const [from, to, border, iconColor] = COLOR_MAP[color].split(' ');
              return (
                <div key={title} className="glass-hover p-6 group cursor-default">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${from} ${to} border ${border} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-16 text-center border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-black text-white mb-3">Ready to Transform Your Hiring?</h3>
          <p className="text-white/40 mb-6 text-sm">Join hundreds of companies using TalentIQ to find the best talent faster.</p>
          <button onClick={() => document.getElementById('auth-panel').scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
            Start for Free — No Credit Card Required
          </button>
        </div>
        <div className="mt-12 text-xs text-white/20">
          © 2024 TalentIQ AI Recruitment Platform • Built with ❤️ by Swetha Kapse
        </div>
      </div>
    </div>
  );
}
