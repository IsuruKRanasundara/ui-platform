'use client';

import { useMemo, useState } from 'react';
import { BarChart3, ChevronRight, Layers3, MoonStar, SunMedium } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/lib/theme/theme-provider';
import {
  getDefaultComponentId,
  playgroundComponentMap,
  playgroundComponents,
  type PlaygroundComponentId,
} from './component-catalog';
import { LivePreview } from './live-preview';
import { PropsPanel } from './props-panel';
import { CodePanel } from './code-panel';
import { ColorPickerPanel } from './color-picker';

type PreviewSize = 'mobile' | 'tablet' | 'desktop' | 'full';

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function PlaygroundShell() {
  const { state, mode, preset, toggleMode, exportThemeJson, exportTailwindConfig } = useTheme();
  const [selectedComponentId, setSelectedComponentId] = useState<PlaygroundComponentId>(getDefaultComponentId());
  const [previewSize, setPreviewSize] = useState<PreviewSize>('desktop');
  const [componentProps, setComponentProps] = useState<Record<PlaygroundComponentId, Record<string, unknown>>>(() =>
    Object.fromEntries(
      playgroundComponents.map((component) => [component.id, component.defaults])
    ) as Record<PlaygroundComponentId, Record<string, unknown>>
  );

  const selectedComponent = playgroundComponentMap[selectedComponentId];
  const propsState = componentProps[selectedComponentId];

  const generatedCode = useMemo(
    () => selectedComponent.generateCode(propsState as never, state),
    [propsState, selectedComponent, state]
  );

  const handlePropChange = (key: string, value: unknown) => {
    setComponentProps((current) => ({
      ...current,
      [selectedComponentId]: {
        ...current[selectedComponentId],
        [key]: value,
      },
    }));
  };

  const handleDownloadTheme = () => {
    downloadFile('theme.json', exportThemeJson(), 'application/json');
  };

  const handleDownloadTailwind = () => {
    downloadFile('tailwind-theme.js', exportTailwindConfig(), 'text/javascript');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="absolute inset-0 theme-grid opacity-60" />
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-white/80 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-screen-2xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-20 rounded-[28px] border border-border bg-white/85 px-5 py-4 shadow-lg shadow-slate-200/60 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                  UI Component Library Platform
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Live theme system, code preview, and component explorer
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-slate-600">
                {preset.name}
              </span>
              <Button variant="outline" size="sm" onClick={toggleMode}>
                {mode === 'dark' ? <SunMedium className="mr-2 h-4 w-4" /> : <MoonStar className="mr-2 h-4 w-4" />}
                {mode === 'dark' ? 'Light mode' : 'Dark mode'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadTheme}>
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadTailwind}>
                Export Tailwind
              </Button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          <aside className="space-y-4">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-4 w-4" />
                  Component Library
                </CardTitle>
                <CardDescription>
                  Browse a small but production-ready set of primitives with live previews.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {playgroundComponents.map((component) => {
                  const active = component.id === selectedComponentId;

                  return (
                    <button
                      key={component.id}
                      type="button"
                      onClick={() => setSelectedComponentId(component.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-background hover:border-primary/30 hover:bg-muted/40'
                      }`}
                    >
                      <div className={`mt-0.5 rounded-xl border p-2 ${active ? 'border-primary/30 bg-white' : 'border-border bg-muted/30'}`}>
                        {component.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-950">{component.name}</p>
                          <ChevronRight className={`h-4 w-4 ${active ? 'text-primary' : 'text-slate-400'}`} />
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                          {component.category}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{component.description}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Workspace summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
                  <span>Theme variables</span>
                  <span className="font-mono text-xs">5 editable</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
                  <span>Preview modes</span>
                  <span className="font-mono text-xs">4 responsive</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
                  <span>Saved locally</span>
                  <span className="font-mono text-xs">Yes</span>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-6">
            <LivePreview
              title={`${selectedComponent.name} preview`}
              description="The live render updates as you change props or theme colors."
              preview={selectedComponent.preview(propsState as never)}
              previewSize={previewSize}
              onPreviewSizeChange={setPreviewSize}
            />

            <CodePanel
              key={generatedCode}
              initialCode={generatedCode}
              filename={`${selectedComponent.id}.tsx`}
            />
          </main>

          <aside className="space-y-6">
            <PropsPanel
              component={selectedComponent}
              values={propsState}
              onChange={handlePropChange}
            />
            <ColorPickerPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}