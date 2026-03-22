'use client';
import * as React from 'react';

export default function OptionsBar({
  data,
}: {
  data: { label: string; count: number }[];
}): React.ReactElement | null {
  if (!data || data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-3">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
        <span className="font-semibold">Options</span>
        <span>{total} selections</span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-700">
        {data.map((p, i) => {
          const pct = total > 0 ? (p.count / total) * 100 : 0;
          const colors = [
            'from-cyan-500 to-blue-500',
            'from-purple-500 to-fuchsia-500',
            'from-emerald-500 to-teal-500',
            'from-amber-500 to-orange-500',
          ];
          const gradient = colors[i % colors.length];

          return (
            <div
              key={i}
              className={`h-full bg-gradient-to-r ${gradient}`}
              style={{ width: `${pct}%` }}
              title={`${p.label}: ${p.count}`}
            />
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
        {data.map((p, i) => (
          <span key={i} className="rounded-lg border border-slate-700 bg-slate-900/40 px-2 py-1 text-slate-200">
            <span className="font-semibold">{p.label}</span> {p.count}
          </span>
        ))}
      </div>
    </div>
  );
}
