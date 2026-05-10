import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Plus, Compass, DollarSign,
  CheckSquare, FileText, User, LogOut, BarChart3,
  Globe, X,
} from 'lucide-react';
import { useAuthStore } from '../../store';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/trips/new', icon: Plus, label: 'Plan New Trip' },
  { to: '/cities', icon: Compass, label: 'City Explorer' },
  { to: '/activities', icon: Globe, label: 'Activities' },
];

const tripItems = [
  { to: '/budget', icon: DollarSign, label: 'Budget Tracker' },
  { to: '/packing', icon: CheckSquare, label: 'Packing List' },
  { to: '/notes', icon: FileText, label: 'Trip Notes' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          bg-gradient-to-b from-[#012f61] via-[#0d61a3] to-[#064a87]
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#ffb347] flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Traveloop</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" onClick={() => { navigate('/profile'); onClose(); }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover border-2 border-white/30" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ffb347] flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/60 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">Main</p>
          <div className="flex flex-col gap-0.5 mb-6">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-white text-[#0d61a3] shadow-md'
                    : 'text-white/80 hover:bg-white/15 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">Tools</p>
          <div className="flex flex-col gap-0.5 mb-6">
            {tripItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-white text-[#0d61a3] shadow-md'
                    : 'text-white/80 hover:bg-white/15 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </div>

          {user?.isAdmin && (
            <>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">Admin</p>
              <div className="flex flex-col gap-0.5 mb-6">
                <NavLink
                  to="/admin"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${isActive
                      ? 'bg-white text-[#0d61a3] shadow-md'
                      : 'text-white/80 hover:bg-white/15 hover:text-white'
                    }`
                  }
                >
                  <BarChart3 size={18} />
                  Analytics
                </NavLink>
              </div>
            </>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-0.5">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive ? 'bg-white text-[#0d61a3]' : 'text-white/80 hover:bg-white/15 hover:text-white'}`
            }
          >
            <User size={18} />
            Profile & Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all duration-150 w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
