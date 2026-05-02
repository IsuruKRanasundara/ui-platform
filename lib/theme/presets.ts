import type { ThemePreset } from './types';

const baseLight = {
  background: '0 0% 100%',
  foreground: '222.2 47.4% 11.2%',
  card: '0 0% 100%',
  cardForeground: '222.2 47.4% 11.2%',
  primaryForeground: '210 40% 98%',
  secondaryForeground: '210 40% 98%',
  accentForeground: '222.2 47.4% 11.2%',
  muted: '210 40% 96.1%',
  mutedForeground: '215.4 16.3% 46.9%',
  border: '214.3 31.8% 91.4%',
  input: '214.3 31.8% 91.4%',
  destructive: '0 84.2% 60.2%',
  destructiveForeground: '210 40% 98%',
};

const baseDark = {
  background: '222.2 84% 4.9%',
  foreground: '210 40% 98%',
  card: '222.2 84% 4.9%',
  cardForeground: '210 40% 98%',
  primaryForeground: '222.2 47.4% 11.2%',
  secondaryForeground: '210 40% 98%',
  accentForeground: '210 40% 98%',
  muted: '217.2 32.6% 17.5%',
  mutedForeground: '215 20.2% 65.1%',
  border: '217.2 32.6% 17.5%',
  input: '217.2 32.6% 17.5%',
  destructive: '0 62.8% 30.6%',
  destructiveForeground: '210 40% 98%',
};

function createPreset(id: string, name: string, description: string, primary: string, secondary: string, accent: string, ring: string): ThemePreset {
  return {
    id,
    name,
    description,
    light: {
      ...baseLight,
      primary,
      secondary,
      accent,
      ring,
    },
    dark: {
      ...baseDark,
      primary,
      secondary,
      accent,
      ring,
    },
  };
}

export const themePresets: ThemePreset[] = [
  createPreset(
    'vercel',
    'Vercel Slate',
    'Neutral blue slate styling with a crisp product feel.',
    '221.2 83.2% 53.3%',
    '215.4 16.3% 46.9%',
    '210 40% 96.1%',
    '221.2 83.2% 53.3%'
  ),
  createPreset(
    'emerald',
    'Emerald Studio',
    'A sharper green direction for internal design systems.',
    '142.1 76.2% 36.3%',
    '155.4 32.6% 26.5%',
    '138 76.5% 96.7%',
    '142.1 76.2% 36.3%'
  ),
  createPreset(
    'amber',
    'Amber Foundry',
    'Warmer brand accents for editorial or marketplace products.',
    '38.4 92.3% 50.2%',
    '28.4 34.8% 32.2%',
    '48 96.6% 89.6%',
    '38.4 92.3% 50.2%'
  ),
  createPreset(
    'rose',
    'Rose Harbor',
    'A more expressive palette for consumer-facing UI kits.',
    '346.8 77.2% 49.8%',
    '334.5 32.5% 34.9%',
    '340 75% 96.1%',
    '346.8 77.2% 49.8%'
  ),
];

export const defaultPresetId = 'vercel';