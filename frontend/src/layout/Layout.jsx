import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { i18n } = useTranslation();
  const rtl = (localStorage.getItem('lang') || i18n.language) === 'ar';
  return (
    <div className={`flex ${rtl ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
