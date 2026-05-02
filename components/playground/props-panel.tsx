'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { ControlDefinition, PlaygroundComponentEntry } from './component-catalog';

interface PropsPanelProps {
  component: PlaygroundComponentEntry;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function PropsPanel({ component, values, onChange }: PropsPanelProps) {
  const renderControl = (control: ControlDefinition) => {
    const value = values[control.key];

    switch (control.kind) {
      case 'text':
        return (
          <Input
            value={String(value ?? '')}
            onChange={(event) => onChange(control.key, event.target.value)}
            placeholder={control.placeholder}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={String(value ?? '')}
            onChange={(event) => onChange(control.key, event.target.value)}
            placeholder={control.placeholder}
          />
        );
      case 'select':
        return (
          <div className="grid grid-cols-2 gap-2">
            {control.options?.map((option) => {
              const isActive = String(value) === option;

              return (
                <Button
                  key={option}
                  type="button"
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onChange(control.key, option)}
                  className="justify-start"
                >
                  {option}
                </Button>
              );
            })}
          </div>
        );
      case 'toggle':
        return (
          <Button
            type="button"
            variant={Boolean(value) ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(control.key, !Boolean(value))}
          >
            {Boolean(value) ? 'Enabled' : 'Disabled'}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Props and variants</CardTitle>
        <CardDescription>{component.name} controls and live configuration.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {component.controls.map((control) => (
          <label key={control.key} className="block space-y-2">
            <span className="block text-sm font-medium text-foreground">{control.label}</span>
            {renderControl(control)}
            {control.helperText ? <span className="block text-xs text-muted-foreground">{control.helperText}</span> : null}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}