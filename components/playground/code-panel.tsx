'use client';

import { Check, Copy, Download, Code2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CodePanelProps {
  initialCode: string;
  filename: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightLine(line: string) {
  const escaped = escapeHtml(line);
  return escaped
    .replace(
      /(&lt;\/?[A-Za-z][A-Za-z0-9]*)/g,
      '<span class="text-sky-400">$1</span>'
    )
    .replace(/(\bimport\b|\bexport\b|\bconst\b|\bfunction\b|\breturn\b|\btrue\b|\bfalse\b|\bundefined\b|\bnull\b)/g, '<span class="text-violet-400">$1</span>')
    .replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span class="text-amber-300">$1</span>')
    .replace(/(\/\/.*$)/g, '<span class="text-slate-500">$1</span>');
}

function copyToClipboard(value: string) {
  return navigator.clipboard.writeText(value);
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function CodePanel({ initialCode, filename }: CodePanelProps) {
  const [draftCode, setDraftCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  const highlightedCode = useMemo(
    () =>
      draftCode
        .split('\n')
        .map(
          (line, index) =>
            `<div class="flex gap-4"><span class="w-8 shrink-0 text-right text-slate-500">${String(index + 1).padStart(2, '0')}</span><span class="min-w-0 flex-1">${highlightLine(line)}</span></div>`
        )
        .join(''),
    [draftCode]
  );

  const handleCopy = async () => {
    await copyToClipboard(draftCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    downloadFile(filename, draftCode);
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code2 className="h-4 w-4" />
              Code preview
            </CardTitle>
            <CardDescription>Editable TSX with copy and download actions.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={draftCode}
          onChange={(event) => setDraftCode(event.target.value)}
          className="min-h-[18rem] font-mono text-xs leading-6"
          spellCheck={false}
        />
        <div className="overflow-hidden rounded-2xl border border-border bg-slate-950 text-slate-100">
          <div className="border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            Syntax preview
          </div>
          <pre className="overflow-auto p-4 text-xs leading-6">
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}