import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Layout() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = i18n.language;

  return (
    <div className={`flex min-h-screen ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar />
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 flex flex-col">
        <Header />
        <main className="flex-1 mt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
