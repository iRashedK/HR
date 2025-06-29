import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function Header() {
  const { i18n } = useTranslation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  return (
    <header className="flex justify-between items-center p-4">
      <button onClick={toggleLang} className="px-4 py-2 border rounded hover:bg-purple-50 dark:hover:bg-purple-900">
        {i18n.language === 'ar' ? 'English' : 'العربية'}
      </button>
      <button onClick={() => setDark(d => !d)} className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        {dark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
