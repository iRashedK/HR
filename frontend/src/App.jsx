import { useState } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import { Home, User, BookOpen, Upload, Settings, LayoutDashboard, Target, Puzzle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Recommendations from './pages/Recommendations';
import Library from './pages/Library';
import UploadPage from './pages/UploadPage';
import SettingsPage from './pages/SettingsPage';
import SkillGap from './pages/SkillGap';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: User, label: 'Employees' },
  { to: '/recommendations', icon: Target, label: 'Recommendations' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/skill-gap', icon: Puzzle, label: 'Skill Gap' },
];

export default function App() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <aside className={`bg-gray-800 text-white ${open ? 'w-48' : 'w-14'} duration-200`}>
        <button className="p-2" onClick={() => setOpen(!open)}>☰</button>
        <nav className="mt-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
              }
            >
              <Icon size={20} />
              {open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/library" element={<Library />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
