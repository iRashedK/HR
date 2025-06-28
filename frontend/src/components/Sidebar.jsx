import { Home, Upload, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="bg-[#f7f5ff] dark:bg-[#1e1b4b] w-64 min-h-screen p-6 rounded-r-xl shadow-lg text-right">
      <h1 className="text-xl font-bold mb-8 text-gray-700 dark:text-white">رشُد</h1>
      <nav className="space-y-4 text-sm">
        <Link
          to="/dashboard"
          className={`flex items-center justify-end gap-3 px-4 py-2 rounded-lg ${isActive('/dashboard') ? 'bg-indigo-100 font-bold' : 'hover:bg-indigo-50'} dark:hover:bg-indigo-900 dark:text-gray-300`}
        >
          <Home size={18} />
          <span>لوحة القيادة</span>
        </Link>
        <Link
          to="/upload"
          className={`flex items-center justify-end gap-3 px-4 py-2 rounded-lg ${isActive('/upload') ? 'bg-indigo-100 font-bold' : 'hover:bg-indigo-50'} dark:hover:bg-indigo-900 dark:text-gray-300`}
        >
          <Upload size={18} />
          <span>رفع الملف</span>
        </Link>
        <Link
          to="/library"
          className={`flex items-center justify-end gap-3 px-4 py-2 rounded-lg ${isActive('/library') ? 'bg-indigo-100 font-bold' : 'hover:bg-indigo-50'} dark:hover:bg-indigo-900 dark:text-gray-300`}
        >
          <BookOpen size={18} />
          <span>مكتبة الدورات</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
