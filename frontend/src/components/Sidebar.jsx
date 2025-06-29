import { Home, Upload, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isActive = (path) => location.pathname === path;
  const lang = localStorage.getItem('lang') || i18n.language;
  const rtl = lang === 'ar';

  return (
    <aside
      className={`bg-light dark:bg-darkbg w-64 min-h-screen p-6 shadow-lg ${
        rtl ? 'rounded-l-xl text-right' : 'rounded-r-xl text-left'
      }`}
    >
      <h1 className="text-xl font-bold mb-8 text-gray-700 dark:text-white">{t('title')}</h1>
      <nav className="space-y-4 text-sm">
        <Link
          to="/dashboard"
          className={`flex items-center ${
            rtl ? 'flex-row-reverse justify-end' : 'justify-start'
          } gap-3 px-4 py-2 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-accent/20 font-bold'
              : 'hover:bg-accent/10'
          } dark:hover:bg-accent/30 dark:text-gray-300`}
        >
          <Home size={18} />
          <span>{t('sidebar.dashboard')}</span>
        </Link>
        <Link
          to="/upload"
          className={`flex items-center ${
            rtl ? 'flex-row-reverse justify-end' : 'justify-start'
          } gap-3 px-4 py-2 rounded-lg transition-colors ${
            isActive('/upload') ? 'bg-accent/20 font-bold' : 'hover:bg-accent/10'
          } dark:hover:bg-accent/30 dark:text-gray-300`}
        >
          <Upload size={18} />
          <span>{t('sidebar.upload')}</span>
        </Link>
        <Link
          to="/library"
          className={`flex items-center ${
            rtl ? 'flex-row-reverse justify-end' : 'justify-start'
          } gap-3 px-4 py-2 rounded-lg transition-colors ${
            isActive('/library') ? 'bg-accent/20 font-bold' : 'hover:bg-accent/10'
          } dark:hover:bg-accent/30 dark:text-gray-300`}
        >
          <BookOpen size={18} />
          <span>{t('sidebar.library')}</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
