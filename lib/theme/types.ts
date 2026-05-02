export type ThemeMode = 'light' | 'dark';

export type ThemeToken =
  | 'background'
  | 'foreground'
  | 'card'
  | 'cardForeground'
  | 'primary'
  | 'primaryForeground'
  | 'secondary'
  | 'secondaryForeground'
  | 'accent'
  | 'accentForeground'
  | 'muted'
  | 'mutedForeground'
  | 'border'
  | 'input'
  | 'ring'
  | 'destructive'
  | 'destructiveForeground';

export type ThemeColors = Record<ThemeToken, string>;

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemeState {
  presetId: string;
  mode: ThemeMode;
  colors: ThemeColors;
  radius: number;
}

export interface ThemeSnapshot {
  presetId: string;
  mode: ThemeMode;
  colors: ThemeColors;
  radius: number;
}