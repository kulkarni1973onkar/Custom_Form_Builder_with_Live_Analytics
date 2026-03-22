'use client';
import * as React from 'react';
import Card from '@/components/UI/Card';
import { FieldAnalytics } from '@/lib/types';

export default function OptionsBar({
  data,
}: {
  data: { label: string; count: number }[];
}): React.ReactElement | null {
  if (!data || data.length === 0) return null;

  // Render a simple stacked bar for the given options
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
          <span className="truncate">Options</span>
          <span>{total} selections</span>
        </div>
        <div className="flex h-4 w-full overflow-hidden rounded-full border">
          {data.map((p, i) => {
            const pct = total > 0 ? (p.count / total) * 100 : 0;
            return (
              <div
                key={i}
                className="h-full border-r last:border-r-0 bg-blue-500 opacity-80"
                style={{ width: `${pct}%` }}
                title={`${p.label}: ${p.count}`}
              />
            );
          })}
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-600">
          {data.map((p, i) => (
            <span key={i} className="rounded border px-1.5 py-0.5 whitespace-nowrap">
              {p.label} · {p.count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackedBar({
  label,
  parts,
}: {
  label: string;
  parts: { optionId: string; count: number }[];
}): React.ReactElement {
  const total = parts.reduce((s, p) => s + p.count, 0);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
        <span className="truncate">{label}</span>
        <span>{total} responses</span>
      </div>
      <div className="flex h-4 w-full overflow-hidden rounded-full border">
        {parts.map((p) => {
          const pct = total > 0 ? (p.count / total) * 100 : 0;
          return (
            <div
              key={p.optionId}
              className="h-full border-r last:border-r-0"
              style={{ width: `${pct}%` }}
              title={`${p.optionId}: ${p.count}`}
            />
          );
        })}
      </div>
      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-600">
        {parts.map((p) => (
          <span key={p.optionId} className="rounded border px-1.5 py-0.5">
            {p.optionId} · {p.count}
          </span>
        ))}
      </div>
    </div>
  );
}
