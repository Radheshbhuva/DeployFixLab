import React, { useEffect } from 'react';
import { useThemeStore, applyThemeToDOM, getSystemTheme } from '@/store/themeStore';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  useEffect(() => {
    // Initial DOM synchronization
    applyThemeToDOM(resolvedTheme);

    // Watch OS system preference changes in real-time
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const currentTheme = useThemeStore.getState().theme;
      if (currentTheme === 'system') {
        const nextSystemTheme = getSystemTheme();
        useThemeStore.setState({ resolvedTheme: nextSystemTheme });
        applyThemeToDOM(nextSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, resolvedTheme]);

  return <>{children}</>;
};
