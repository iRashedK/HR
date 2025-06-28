import { Home, Upload, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ rtl }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`bg-sidebar dark:bg-[#1e1b4b] w-64 min-h-screen p-6 shadow-lg ${rtl ? 'rounded-l-2xl text-right' : 'rounded-r-2xl text-left'}`}
    >
      <h1 className="text-xl font-bold mb-8 text-gray-700 dark:text-white">{t('title')}</h1>
      <nav className="space-y-4 text-sm">
        <Link
          to="/dashboard"
          className={`flex items-center ${rtl ? 'flex-row-reverse justify-end' : 'justify-start'} gap-3 px-4 py-2 rounded-xl ${isActive('/dashboard') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'} dark:hover:bg-primary/20 dark:text-gray-300`}
        >
          <Home size={18} />
          <span>{t('sidebar.dashboard')}</span>
        </Link>
        <Link
          to="/upload"
          className={`flex items-center ${rtl ? 'flex-row-reverse justify-end' : 'justify-start'} gap-3 px-4 py-2 rounded-xl ${isActive('/upload') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'} dark:hover:bg-primary/20 dark:text-gray-300`}
        >
          <Upload size={18} />
          <span>{t('sidebar.upload')}</span>
        </Link>
        <Link
          to="/library"
          className={`flex items-center ${rtl ? 'flex-row-reverse justify-end' : 'justify-start'} gap-3 px-4 py-2 rounded-xl ${isActive('/library') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'} dark:hover:bg-primary/20 dark:text-gray-300`}
        >
          <BookOpen size={18} />
          <span>{t('sidebar.library')}</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
