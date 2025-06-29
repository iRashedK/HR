import { Home, Upload, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem('lang') || i18n.language;
  const rtl = lang === 'ar';
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-light dark:bg-darkbg shadow-md">
      <div
        className={`flex items-center justify-between px-6 py-4 ${
          rtl ? 'flex-row-reverse' : ''
        }`}
      >
        <h1 className="text-xl font-bold text-gray-700 dark:text-white">
          {t('title')}
        </h1>
        <nav className={`flex gap-4 text-sm ${rtl ? 'flex-row-reverse' : ''}`}>
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/upload') ? 'bg-accent/20 font-bold' : 'hover:bg-accent/10'
            } dark:hover:bg-accent/30 dark:text-gray-300`}
          >
            <Upload size={18} />
            <span>{t('sidebar.upload')}</span>
          </Link>
          <Link
            to="/library"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/library') ? 'bg-accent/20 font-bold' : 'hover:bg-accent/10'
            } dark:hover:bg-accent/30 dark:text-gray-300`}
          >
            <BookOpen size={18} />
            <span>{t('sidebar.library')}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
