import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';

const Layout = () => {
  const { i18n } = useTranslation();
  const [rtl, setRtl] = useState(
    (localStorage.getItem('lang') || i18n.language) === 'ar'
  );

  useEffect(() => {
    const updateDir = (lng) => {
      setRtl((localStorage.getItem('lang') || lng) === 'ar');
    };
    i18n.on('languageChanged', updateDir);
    window.addEventListener('storage', updateDir);
    return () => {
      i18n.off('languageChanged', updateDir);
      window.removeEventListener('storage', updateDir);
    };
  }, [i18n]);

  return (
    <div className={`flex ${rtl ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar rtl={rtl} />
      <div className="flex-1 flex flex-col min-h-screen">
        <header
          className={`p-4 flex ${rtl ? 'justify-start' : 'justify-end'} gap-3`}
        >
          <LanguageToggle />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
