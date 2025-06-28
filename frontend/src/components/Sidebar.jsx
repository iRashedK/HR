import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Target,
  BookOpen,
  Settings,
  Users,
  BarChart2,
} from 'lucide-react';

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload CV' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/recommendations', icon: Target, label: 'Training Recommendations' },
  { to: '/skill-gap', icon: BarChart2, label: 'Skill Gap' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  return (
    <aside
      className={`bg-[#f5f4ff] dark:bg-gray-800 dark:text-white text-gray-900 h-screen flex flex-col shadow-lg rounded-2xl p-4 transition-all duration-200 ${
        open ? 'w-52' : 'w-16'
      } ${rtl ? 'order-last' : ''}`}
    >
      <button className="p-2 mb-4" onClick={() => setOpen(!open)} aria-label="toggle sidebar">
        ☰
      </button>
      {open && (
        <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-3">📚 الأقسام</h2>
      )}
      <nav className="space-y-3 flex-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 hover:bg-[#e3dbff] dark:hover:bg-gray-700 ${
                isActive ? 'bg-[#c6bfff] dark:bg-gray-700 font-semibold' : ''
              }`
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
