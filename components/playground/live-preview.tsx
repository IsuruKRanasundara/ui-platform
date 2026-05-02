'use client';

import type { ReactNode } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PreviewSize = 'mobile' | 'tablet' | 'desktop' | 'full';

interface LivePreviewProps {
  title: string;
  description: string;
  preview: ReactNode;
  previewSize: PreviewSize;
  onPreviewSizeChange: (size: PreviewSize) => void;
}

const previewSizes: Array<{ id: PreviewSize; label: string; icon: ReactNode; width: string }> = [
  { id: 'mobile', label: 'Mobile', icon: <Smartphone className="h-4 w-4" />, width: 'max-w-[390px]' },
  { id: 'tablet', label: 'Tablet', icon: <Tablet className="h-4 w-4" />, width: 'max-w-[768px]' },
  { id: 'desktop', label: 'Desktop', icon: <Monitor className="h-4 w-4" />, width: 'max-w-none' },
  { id: 'full', label: 'Full', icon: <Monitor className="h-4 w-4" />, width: 'max-w-full' },
];

export function LivePreview({
  title,
  description,
  preview,
  previewSize,
  onPreviewSizeChange,
}: LivePreviewProps) {
  const activeSize = previewSizes.find((item) => item.id === previewSize) ?? previewSizes[2];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {previewSizes.map((size) => (
              <Button
                key={size.id}
                type="button"
                size="sm"
                variant={size.id === previewSize ? 'default' : 'outline'}
                onClick={() => onPreviewSizeChange(size.id)}
              >
                {size.icon}
                <span className="ml-2">{size.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-[24px] border border-border bg-muted/20 p-4">
          <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-3 text-xs text-muted-foreground">
            <span>Viewport: {activeSize.label}</span>
            <span>Live CSS variable preview</span>
          </div>
          <div className={`mx-auto w-full ${activeSize.width}`}>
            <div className="overflow-hidden rounded-[22px] border border-border bg-background p-4 shadow-lg">
              {preview}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}