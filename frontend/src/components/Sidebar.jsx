import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, Target, BookOpen, Settings } from 'lucide-react';

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload CV' },
  { to: '/recommendations', icon: Target, label: 'Training Recommendations' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  return (
    <aside
      className={`bg-gray-800 text-white h-screen flex flex-col ${
        open ? 'w-48' : 'w-14'
      } transition-all duration-200 ${rtl ? 'order-last' : ''}`}
    >
      <button className="p-2" onClick={() => setOpen(!open)} aria-label="toggle sidebar">
        ☰
      </button>
      <nav className="mt-4 space-y-2 flex-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <Icon size={20} />
            {open && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
