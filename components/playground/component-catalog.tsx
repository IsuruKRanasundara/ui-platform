'use client';

import type { ReactNode } from 'react';
import { Boxes, LayoutTemplate, PencilRuler, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { ThemeSnapshot } from '@/lib/theme/types';

export type PlaygroundComponentId = 'button' | 'card' | 'input' | 'modal';

export type ControlKind = 'text' | 'textarea' | 'select' | 'toggle';

export interface ControlDefinition {
  key: string;
  label: string;
  kind: ControlKind;
  options?: string[];
  placeholder?: string;
  helperText?: string;
}

export interface PlaygroundComponent<TProps extends Record<string, unknown>> {
  id: PlaygroundComponentId;
  name: string;
  description: string;
  category: string;
  icon: ReactNode;
  controls: ControlDefinition[];
  defaults: TProps;
  preview: (props: TProps) => ReactNode;
  generateCode: (props: TProps, theme: ThemeSnapshot) => string;
}

function createThemeBlock(theme: ThemeSnapshot) {
  const entries = Object.entries(theme.colors)
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`)
    .join('\n');

  return [`const theme = {`, entries, `  mode: ${JSON.stringify(theme.mode)},`, `  radius: ${theme.radius},`, `} as const;`].join('\n');
}

function escapeJsxText(value: string) {
  return value.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function capitalize(value: string) {
  return value.length ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

const buttonComponent: PlaygroundComponent<{
  label: string;
  variant: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size: 'sm' | 'default' | 'lg';
  disabled: boolean;
}> = {
  id: 'button',
  name: 'Button',
  description: 'Primary action button with cva variants and theme-aware styling.',
  category: 'Actions',
  icon: <Sparkles className="h-4 w-4" />,
  defaults: {
    label: 'Click me',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  controls: [
    { key: 'label', label: 'Label', kind: 'text', placeholder: 'Click me' },
    {
      key: 'variant',
      label: 'Variant',
      kind: 'select',
      options: ['default', 'outline', 'ghost', 'destructive', 'secondary'],
    },
    {
      key: 'size',
      label: 'Size',
      kind: 'select',
      options: ['sm', 'default', 'lg'],
    },
    { key: 'disabled', label: 'Disabled', kind: 'toggle' },
  ],
  preview: (props) => (
    <div className="flex items-center justify-center rounded-3xl border border-border bg-card p-10">
      <Button variant={props.variant} size={props.size} disabled={props.disabled}>
        {props.label}
      </Button>
    </div>
  ),
  generateCode: (props, theme) => `import { Button } from '@/components/ui/button';

${createThemeBlock(theme)}

export function ButtonExample() {
  return (
    <Button
      variant=${JSON.stringify(props.variant)}
      size=${JSON.stringify(props.size)}
      ${props.disabled ? 'disabled' : ''}
      className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
    >
      ${escapeJsxText(props.label)}
    </Button>
  );
}`,
};

const cardComponent: PlaygroundComponent<{
  title: string;
  description: string;
  badge: string;
  cta: string;
}> = {
  id: 'card',
  name: 'Card',
  description: 'Content card with a clean hierarchy and CTA footer.',
  category: 'Layout',
  icon: <Boxes className="h-4 w-4" />,
  defaults: {
    title: 'Design systems that scale',
    description: 'Ship reusable building blocks with consistent tokens, variants, and previews.',
    badge: 'New',
    cta: 'Explore tokens',
  },
  controls: [
    { key: 'badge', label: 'Badge', kind: 'text', placeholder: 'New' },
    { key: 'title', label: 'Title', kind: 'text', placeholder: 'Design systems that scale' },
    { key: 'description', label: 'Description', kind: 'textarea', placeholder: 'A concise summary of the component.' },
    { key: 'cta', label: 'Button label', kind: 'text', placeholder: 'Explore tokens' },
  ],
  preview: (props) => (
    <Card className="w-full max-w-lg border-border bg-card shadow-lg">
      <CardHeader>
        <div className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          {props.badge}
        </div>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Built with the current theme tokens.</p>
        <Button size="sm">{props.cta}</Button>
      </CardContent>
    </Card>
  ),
  generateCode: (props, theme) => `import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

${createThemeBlock(theme)}

export function CardExample() {
  return (
    <Card className="border-border bg-card shadow-lg">
      <CardHeader>
        <div className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          ${escapeJsxText(props.badge)}
        </div>
        <CardTitle>${escapeJsxText(props.title)}</CardTitle>
        <CardDescription>${escapeJsxText(props.description)}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Built with the current theme tokens.</p>
        <Button size="sm">${escapeJsxText(props.cta)}</Button>
      </CardContent>
    </Card>
  );
}`,
};

const inputComponent: PlaygroundComponent<{
  label: string;
  placeholder: string;
  value: string;
  helper: string;
}> = {
  id: 'input',
  name: 'Input',
  description: 'Form field with label, helper text, and theme-aware borders.',
  category: 'Forms',
  icon: <PencilRuler className="h-4 w-4" />,
  defaults: {
    label: 'Work email',
    placeholder: 'name@company.com',
    value: 'alex@acme.com',
    helper: 'Used for notifications and team invitations.',
  },
  controls: [
    { key: 'label', label: 'Label', kind: 'text', placeholder: 'Work email' },
    { key: 'placeholder', label: 'Placeholder', kind: 'text', placeholder: 'name@company.com' },
    { key: 'value', label: 'Value', kind: 'text', placeholder: 'alex@acme.com' },
    { key: 'helper', label: 'Helper text', kind: 'textarea', placeholder: 'Used for notifications.' },
  ],
  preview: (props) => (
    <Card className="w-full max-w-md border-border bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">{props.label}</CardTitle>
        <CardDescription>{props.helper}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input value={props.value} placeholder={props.placeholder} readOnly />
        <p className="text-xs text-muted-foreground">Theme-driven border, radius, and focus ring.</p>
      </CardContent>
    </Card>
  ),
  generateCode: (props, theme) => `import { Input } from '@/components/ui/input';

${createThemeBlock(theme)}

export function InputExample() {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium">${escapeJsxText(props.label)}</span>
      <Input
        value=${JSON.stringify(props.value)}
        placeholder=${JSON.stringify(props.placeholder)}
        readOnly
      />
      <p className="text-xs text-muted-foreground">${escapeJsxText(props.helper)}</p>
    </label>
  );
}`,
};

const modalComponent: PlaygroundComponent<{
  title: string;
  description: string;
  actionLabel: string;
  open: boolean;
}> = {
  id: 'modal',
  name: 'Modal',
  description: 'Radix dialog modal with a clear header, body, and actions.',
  category: 'Overlays',
  icon: <LayoutTemplate className="h-4 w-4" />,
  defaults: {
    title: 'Invite collaborators',
    description: 'Give the team access to the current component library workspace.',
    actionLabel: 'Send invite',
    open: true,
  },
  controls: [
    { key: 'title', label: 'Title', kind: 'text', placeholder: 'Invite collaborators' },
    {
      key: 'description',
      label: 'Description',
      kind: 'textarea',
      placeholder: 'Give the team access to the current workspace.',
    },
    { key: 'actionLabel', label: 'Primary action', kind: 'text', placeholder: 'Send invite' },
    { key: 'open', label: 'Open by default', kind: 'toggle' },
  ],
  preview: (props) => (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10">
      <Dialog open={props.open}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            This dialog uses the same theme variables as the rest of the library.
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>{props.actionLabel}</Button>
          </div>
        </DialogContent>
      </Dialog>
      {!props.open && (
        <div className="flex min-h-[20rem] items-center justify-center text-sm text-muted-foreground">
          Enable the toggle to preview the modal.
        </div>
      )}
    </div>
  ),
  generateCode: (props, theme) => `import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

${createThemeBlock(theme)}

export function ModalExample() {
  return (
    <Dialog open=${props.open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>${escapeJsxText(props.title)}</DialogTitle>
          <DialogDescription>${escapeJsxText(props.description)}</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          This dialog uses the same theme variables as the rest of the library.
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>${escapeJsxText(props.actionLabel)}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}`,
};

export const playgroundComponents = [buttonComponent, cardComponent, inputComponent, modalComponent] as const;

export type PlaygroundComponentEntry = (typeof playgroundComponents)[number];

export const playgroundComponentMap = Object.fromEntries(
  playgroundComponents.map((component) => [component.id, component])
) as Record<PlaygroundComponentId, PlaygroundComponentEntry>;

export function getDefaultComponentId() {
  return playgroundComponents[0].id;
}

export function getComponentLabel(componentId: PlaygroundComponentId) {
  return capitalize(playgroundComponentMap[componentId].name);
}