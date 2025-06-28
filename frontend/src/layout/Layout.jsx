import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const Layout = () => {
  const { i18n } = useTranslation();
  const [rtl, setRtl] = useState(
    (localStorage.getItem('lang') || i18n.language) === 'ar'
  );

  useEffect(() => {
    const handleLangChange = (lng) => {
      setRtl((localStorage.getItem('lang') || lng) === 'ar');
    };
    i18n.on('languageChanged', handleLangChange);
    return () => i18n.off('languageChanged', handleLangChange);
  }, [i18n]);

  return (
    <div className={`flex ${rtl ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar rtl={rtl} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
