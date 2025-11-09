import React from 'react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { useLanguageStore } from '../store/languageStore';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'dropdown' | 'flags' | 'compact';
}

const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  de: '🇩🇪', 
  fr: '🇫🇷',
  es: '🇪🇸'
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  variant = 'dropdown' 
}) => {
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  if (variant === 'flags') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {Object.entries(languageFlags).map(([lang, flag]) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang as Language)}
            className={`p-2 rounded-md transition-all duration-200 ${
              language === lang
                ? 'bg-blue-100 border-2 border-blue-500 scale-110'
                : 'hover:bg-gray-100 border-2 border-transparent hover:scale-105'
            }`}
            title={t.languages[lang as keyof typeof t.languages]}
          >
            <span className="text-2xl">{flag}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.keys(languageFlags).map((lang) => (
            <option key={lang} value={lang}>
              {languageFlags[lang as Language]} {lang.toUpperCase()}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <select
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value as Language)}
        className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      >
        <option value="en">
          {languageFlags.en} {t.languages.english}
        </option>
        <option value="de">
          {languageFlags.de} {t.languages.german}
        </option>
        <option value="fr">
          {languageFlags.fr} {t.languages.french}
        </option>
        <option value="es">
          {languageFlags.es} {t.languages.spanish}
        </option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;