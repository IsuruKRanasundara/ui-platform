'use client';

import { Paintbrush2, RotateCcw, SunMoon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/lib/theme/theme-provider';
import { hslToHex, hexToHsl } from '@/lib/theme/color-utils';
import { themePresets } from '@/lib/theme/presets';
import type { ThemeToken } from '@/lib/theme/types';

const editableTokens: Array<{ token: ThemeToken; label: string; help: string }> = [
  { token: 'background', label: 'Background', help: 'Page and surface base' },
  { token: 'foreground', label: 'Foreground', help: 'Body copy and labels' },
  { token: 'primary', label: 'Primary', help: 'Main action color' },
  { token: 'secondary', label: 'Secondary', help: 'Supporting actions' },
  { token: 'accent', label: 'Accent', help: 'Highlights and badges' },
];

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ColorPickerPanel() {
  const {
    state,
    colors,
    mode,
    isCustom,
    preset,
    setColor,
    setRadius,
    setPreset,
    toggleMode,
    resetTheme,
    exportThemeJson,
    exportTailwindConfig,
  } = useTheme();

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Paintbrush2 className="h-4 w-4" />
          Theme Studio
        </CardTitle>
        <CardDescription>
          Tune the global CSS variables and preview the UI update instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Mode</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark output.</p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleMode}>
              <SunMoon className="mr-2 h-4 w-4" />
              {mode === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>

          <div className="grid gap-2">
            {themePresets.map((item) => {
              const active = item.id === preset.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreset(item.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    active
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-background hover:border-primary/30 hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: `hsl(${item.light.primary})` }} />
                      <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: `hsl(${item.light.secondary})` }} />
                      <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: `hsl(${item.light.accent})` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <span>{preset.name}</span>
            <span>{isCustom ? 'Custom adjustments' : 'Preset defaults'}</span>
          </div>
        </div>

        <div className="space-y-4">
          {editableTokens.map(({ token, label, help }) => (
            <label key={token} className="block space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="block text-sm font-medium text-foreground">{label}</span>
                  <span className="block text-xs text-muted-foreground">{help}</span>
                </div>
                <span className="rounded-full border border-border bg-background px-2 py-1 text-[11px] font-mono text-muted-foreground">
                  {colors[token]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={hslToHex(colors[token])}
                  onChange={(event) => setColor(token, hexToHsl(event.target.value))}
                  className="h-10 w-12 cursor-pointer rounded-md border border-border bg-background p-1"
                />
                <Input
                  value={colors[token]}
                  onChange={(event) => setColor(token, event.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </label>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Radius</p>
              <p className="text-xs text-muted-foreground">Control the component corner curve.</p>
            </div>
            <span className="rounded-full border border-border bg-background px-2 py-1 text-xs font-mono text-muted-foreground">
              {state.radius}px
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={20}
            step={1}
            value={state.radius}
            onChange={(event) => setRadius(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
          />
          <p className="text-xs text-muted-foreground">The current component system uses a rounded, shadcn-style radius.</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => downloadFile('ui-theme.json', exportThemeJson(), 'application/json')}
          >
            Export JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadFile('tailwind-theme.js', exportTailwindConfig(), 'text/javascript')}
          >
            Export Tailwind
          </Button>
          <Button variant="ghost" className="sm:col-span-2" onClick={resetTheme}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset theme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}