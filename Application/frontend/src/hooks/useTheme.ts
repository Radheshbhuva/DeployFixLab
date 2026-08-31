import { useThemeStore, type ThemeMode, type ResolvedTheme } from '@/store/themeStore';

export interface UseThemeReturn {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
    setTheme,
    toggleTheme,
  };
};
