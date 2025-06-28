import { useTranslation } from 'react-i18next';
import { Globe2 } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20"
      aria-label="Toggle language"
    >
      <Globe2 size={18} />
    </button>
  );
};

export default LanguageToggle;
