import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,
      setTheme: (theme) => {
        set({ theme });
        const { initializeTheme } = get();
        initializeTheme();
      },
      toggleTheme: () => {
        const { theme, setTheme } = get();
        if (theme === 'light') {
          setTheme('dark');
        } else if (theme === 'dark') {
          setTheme('light');
        } else {
          // If system, switch to the opposite of current system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(systemPrefersDark ? 'light' : 'dark');
        }
      },
      initializeTheme: () => {
        const { theme } = get();
        let isDark = false;
        
        if (theme === 'dark') {
          isDark = true;
        } else if (theme === 'light') {
          isDark = false;
        } else {
          // System preference
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        set({ isDark });
        
        // Apply theme to document
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Initialize theme on module load
if (typeof window !== 'undefined') {
  useThemeStore.getState().initializeTheme();
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme, initializeTheme } = useThemeStore.getState();
    if (theme === 'system') {
      initializeTheme();
    }
  });
}