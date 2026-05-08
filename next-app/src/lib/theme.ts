export interface ThemeStyles {
  bg: string;
  card: string;
  border: string;
  borderH: string;
  txt: string;
  txt2: string;
  txt3: string;
  accent: string;
  accentDim: string;
  surf: string;
  surfH: string;
}

export const DARK_THEME: ThemeStyles = {
  bg: '#0B0F14',
  card: '#111820',
  border: 'rgba(255,255,255,0.07)',
  borderH: 'rgba(255,255,255,0.13)',
  txt: '#EEF0F4',
  txt2: '#8A94A6',
  txt3: '#515C6E',
  accent: '#22C55E',
  accentDim: 'rgba(34,197,94,0.12)',
  surf: 'rgba(255,255,255,0.035)',
  surfH: 'rgba(255,255,255,0.06)',
};

export const LIGHT_THEME: ThemeStyles = {
  bg: '#F5F7FA',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.08)',
  borderH: 'rgba(0,0,0,0.14)',
  txt: '#1A1D23',
  txt2: '#5F6B7A',
  txt3: '#9CA3AF',
  accent: '#16A34A',
  accentDim: 'rgba(22,163,74,0.1)',
  surf: 'rgba(0,0,0,0.03)',
  surfH: 'rgba(0,0,0,0.05)',
};

export function getTheme(mode: 'dark' | 'light' | 'system'): ThemeStyles {
  if (mode === 'dark') return DARK_THEME;
  if (mode === 'light') return LIGHT_THEME;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return DARK_THEME;
  }
  return LIGHT_THEME;
}
