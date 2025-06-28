import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'Rushd',
      sidebar: {
        dashboard: 'Dashboard',
        upload: 'Upload CV',
        library: 'Course Library',
      },
    },
  },
  ar: {
    translation: {
      title: 'رشُد',
      sidebar: {
        dashboard: 'لوحة القيادة',
        upload: 'رفع الملف',
        library: 'مكتبة الدورات',
      },
    },
  },
};

const lang = localStorage.getItem('lang') || 'ar';

i18n.use(initReactI18next).init({
  resources,
  lng: lang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('lang', lng);
});

document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

export default i18n;
