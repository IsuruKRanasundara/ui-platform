'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { hexToHsl } from './color-utils';
import { defaultPresetId, themePresets } from './presets';
import type { ThemeMode, ThemePreset, ThemeSnapshot, ThemeState, ThemeToken } from './types';

const STORAGE_KEY = 'ui-platform-theme';

function getPreset(presetId: string) {
  return themePresets.find((preset) => preset.id === presetId) ?? themePresets[0];
}

function buildState(presetId: string, mode: ThemeMode): ThemeState {
  const preset = getPreset(presetId);

  return {
    presetId: preset.id,
    mode,
    colors: mode === 'dark' ? preset.dark : preset.light,
    radius: 14,
  };
}

function loadState(): ThemeState {
  if (typeof window === 'undefined') {
    return buildState(defaultPresetId, 'light');
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return buildState(defaultPresetId, 'light');
    }

    const parsed = JSON.parse(saved) as Partial<ThemeState>;
    const presetId = parsed.presetId ?? defaultPresetId;
    const mode = parsed.mode === 'dark' ? 'dark' : 'light';
    const preset = getPreset(presetId);

    return {
      presetId: preset.id,
      mode,
      colors: parsed.colors ?? (mode === 'dark' ? preset.dark : preset.light),
      radius: typeof parsed.radius === 'number' ? parsed.radius : 14,
    };
  } catch {
    return buildState(defaultPresetId, 'light');
  }
}

function areColorsEqual(left: ThemeSnapshot['colors'], right: ThemeSnapshot['colors']) {
  return Object.keys(left).every((key) => left[key as ThemeToken] === right[key as ThemeToken]);
}

interface ThemeContextValue {
  state: ThemeState;
  preset: ThemePreset;
  isCustom: boolean;
  setPreset: (presetId: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setColor: (token: ThemeToken, value: string) => void;
  setRadius: (radius: number) => void;
  resetTheme: () => void;
  exportThemeJson: () => string;
  exportTailwindConfig: () => string;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeVariables(state: ThemeState) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const { colors, mode, radius } = state;

  Object.entries(colors).forEach(([token, value]) => {
    root.style.setProperty(`--${token}`, value);
  });

  root.style.setProperty('--radius', `${radius}px`);
  root.classList.toggle('dark', mode === 'dark');
  root.dataset.theme = mode;
  root.style.colorScheme = mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ThemeState>(() => loadState());

  useEffect(() => {
    applyThemeVariables(state);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const preset = useMemo(() => getPreset(state.presetId), [state.presetId]);
  const isCustom = useMemo(() => {
    const expected = state.mode === 'dark' ? preset.dark : preset.light;
    return !areColorsEqual(state.colors, expected);
  }, [preset, state.colors, state.mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      state,
      preset,
      isCustom,
      setPreset: (presetId: string) => {
        const nextPreset = getPreset(presetId);
        setState((current) => ({
          ...current,
          presetId: nextPreset.id,
          colors: current.mode === 'dark' ? nextPreset.dark : nextPreset.light,
        }));
      },
      setMode: (mode: ThemeMode) => {
        setState((current) => {
          const nextPreset = getPreset(current.presetId);
          return {
            ...current,
            mode,
            colors: mode === 'dark' ? nextPreset.dark : nextPreset.light,
          };
        });
      },
      toggleMode: () => {
        setState((current) => {
          const nextMode: ThemeMode = current.mode === 'dark' ? 'light' : 'dark';
          const nextPreset = getPreset(current.presetId);

          return {
            ...current,
            mode: nextMode,
            colors: nextMode === 'dark' ? nextPreset.dark : nextPreset.light,
          };
        });
      },
      setColor: (token: ThemeToken, value: string) => {
        setState((current) => ({
          ...current,
          colors: {
            ...current.colors,
            [token]: value,
          },
        }));
      },
      setRadius: (radius: number) => {
        setState((current) => ({ ...current, radius }));
      },
      resetTheme: () => {
        const nextPreset = getPreset(defaultPresetId);
        setState({
          presetId: nextPreset.id,
          mode: 'light',
          colors: nextPreset.light,
          radius: 14,
        });
      },
      exportThemeJson: () =>
        JSON.stringify(
          {
            presetId: state.presetId,
            mode: state.mode,
            radius: state.radius,
            colors: state.colors,
          },
          null,
          2
        ),
      exportTailwindConfig: () =>
        [
          'module.exports = {',
          '  theme: {',
          '    extend: {',
          '      colors: {',
          "        background: 'hsl(var(--background))',",
          "        foreground: 'hsl(var(--foreground))',",
          "        primary: 'hsl(var(--primary))',",
          "        secondary: 'hsl(var(--secondary))',",
          "        accent: 'hsl(var(--accent))',",
          '      },',
          '      borderRadius: {',
          "        xl: 'var(--radius)',",
          '      },',
          '    },',
          '  },',
          '};',
        ].join('\n'),
    }),
    [isCustom, preset, state]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return {
    ...context,
    colors: context.state.colors,
    mode: context.state.mode,
    presetId: context.state.presetId,
    radius: context.state.radius,
  };
}

export function toHsl(hex: string) {
  return hexToHsl(hex);
}