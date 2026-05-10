import { Menu, Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/trips': 'My Trips',
  '/trips/new': 'Plan New Trip',
  '/cities': 'City Explorer',
  '/activities': 'Activity Search',
  '/budget': 'Budget Tracker',
  '/packing': 'Packing List',
  '/notes': 'Trip Notes',
  '/profile': 'Profile & Settings',
  '/admin': 'Admin Analytics',
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const base = '/' + location.pathname.split('/')[1];
  const title = PAGE_TITLES[base] || 'Traveloop';

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] px-4 lg:px-6 h-16 flex items-center gap-4">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-[#f1f5f9] text-[#64748b] transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-bold text-[#1e293b]">{title}</h1>
      </div>

      <div className="hidden sm:flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2 w-48 lg:w-64">
        <Search size={15} className="text-[#94a3b8]" />
        <span className="text-sm text-[#94a3b8]">Search trips...</span>
      </div>

      <button type="button" aria-label="Notifications" className="relative p-2 rounded-xl hover:bg-[#f1f5f9] text-[#64748b] transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full"></span>
      </button>
    </header>
  );
}
