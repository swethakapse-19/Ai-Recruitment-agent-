import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, LayoutDashboard, Upload, Users, BarChart3, LogOut, Settings, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Resume' },
  { to: '/candidates', icon: Users, label: 'Candidates' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-space-900/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-6 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
            <Brain size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold">
            <span className="text-white">Talent</span>
            <span className="gradient-text">IQ</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${pathname === to
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
            <Bell size={16} />
          </button>
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                {user.name?.[0] || 'U'}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-white leading-none">{user.name}</div>
                <div className="text-xs text-white/40 capitalize mt-0.5">{user.role}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
}
