import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../i18n/translations';

interface LanguageState {
  currentLanguage: Language;
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'en',
      language: 'en',
      setLanguage: (language: Language) => set({ currentLanguage: language, language }),
    }),
    {
      name: 'language-storage',
    }
  )
);