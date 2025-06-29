import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <aside
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`bg-white dark:bg-gray-800 w-64 p-6 flex flex-col space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <h1 className="text-2xl font-bold dark:text-gray-100">{t('title')}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>

      <nav className="flex flex-col space-y-2 mt-4">
        <NavLink to="/dashboard" className="px-3 py-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900">
          {t('menu.dashboard')}
        </NavLink>
        <NavLink to="/upload" className="px-3 py-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900">
          {t('menu.upload')}
        </NavLink>
        <NavLink to="/library" className="px-3 py-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900">
          {t('menu.library')}
        </NavLink>
      </nav>
    </aside>
  );
}
