'use client';
import * as React from 'react';
import Card from '@/components/UI/Card';

export default function RatingsChart({
  data,
}: {
  data: { score: string; count: number }[];
}): React.ReactElement | null {
  if (!data || data.length === 0) return null;

  return (
    <Card className="bg-slate-900/50 border border-slate-700 p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-200">Rating Breakdown</h4>
      <div className="grid gap-3">
        {data.map((d, i) => (
          <Bar key={i} label={d.score} value={d.count} />
        ))}
      </div>
    </Card>
  );
}

function Bar({ label, value }: { label: string; value: number }): React.ReactElement {
  const total = 5;
  const pct = Math.min(100, (value / total) * 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>⭐ {label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
