import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { i18n } = useTranslation();
  const rtl = (localStorage.getItem('lang') || i18n.language) === 'ar';
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 p-6 ${rtl ? 'text-right' : 'text-left'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
