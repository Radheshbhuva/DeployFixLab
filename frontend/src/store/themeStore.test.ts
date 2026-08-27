import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore, applyThemeToDOM } from './themeStore';

// Polyfill window / document / localStorage for Vitest Node environment
const mockStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
};

const classListSet = new Set<string>();
const mockDocument = {
  documentElement: {
    classList: {
      add: (cls: string) => classListSet.add(cls),
      remove: (cls: string) => classListSet.delete(cls),
      contains: (cls: string) => classListSet.has(cls),
    },
    style: {
      colorScheme: '',
    },
  },
};

vi.stubGlobal('localStorage', mockLocalStorage);
vi.stubGlobal('document', mockDocument);
vi.stubGlobal('window', {
  localStorage: mockLocalStorage,
  matchMedia: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});

describe('themeStore & DOM integration', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    classListSet.clear();
    mockDocument.documentElement.style.colorScheme = '';
    useThemeStore.setState({ theme: 'system', resolvedTheme: 'light' });
  });

  it('initializes with system mode and default theme', () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBe('system');
    expect(['light', 'dark']).toContain(state.resolvedTheme);
  });

  it('sets theme to light and updates DOM correctly', () => {
    useThemeStore.getState().setTheme('light');
    const state = useThemeStore.getState();

    expect(state.theme).toBe('light');
    expect(state.resolvedTheme).toBe('light');
    expect(mockDocument.documentElement.classList.contains('light')).toBe(true);
    expect(mockDocument.documentElement.classList.contains('dark')).toBe(false);
    expect(mockDocument.documentElement.style.colorScheme).toBe('light');
  });

  it('sets theme to dark and updates DOM correctly', () => {
    useThemeStore.getState().setTheme('dark');
    const state = useThemeStore.getState();

    expect(state.theme).toBe('dark');
    expect(state.resolvedTheme).toBe('dark');
    expect(mockDocument.documentElement.classList.contains('dark')).toBe(true);
    expect(mockDocument.documentElement.classList.contains('light')).toBe(false);
    expect(mockDocument.documentElement.style.colorScheme).toBe('dark');
  });

  it('toggles theme between light and dark', () => {
    useThemeStore.getState().setTheme('light');
    expect(useThemeStore.getState().resolvedTheme).toBe('light');

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().resolvedTheme).toBe('dark');
    expect(mockDocument.documentElement.classList.contains('dark')).toBe(true);

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().resolvedTheme).toBe('light');
    expect(mockDocument.documentElement.classList.contains('light')).toBe(true);
  });

  it('applyThemeToDOM applies classes and colorScheme property', () => {
    applyThemeToDOM('dark');
    expect(mockDocument.documentElement.classList.contains('dark')).toBe(true);
    expect(mockDocument.documentElement.style.colorScheme).toBe('dark');

    applyThemeToDOM('light');
    expect(mockDocument.documentElement.classList.contains('light')).toBe(true);
    expect(mockDocument.documentElement.classList.contains('dark')).toBe(false);
    expect(mockDocument.documentElement.style.colorScheme).toBe('light');
  });
});
