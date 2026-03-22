'use client';
import * as React from 'react';
import Card from '@/components/UI/Card';
import { FieldAnalytics } from '@/lib/types';

export default function RatingsChart({
  data,
}: {
  data: { score: string; count: number }[];
}): React.ReactElement | null {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((d, i) => (
          <Bar key={i} label={d.score} avg={d.count} />
        ))}
      </div>
    </div>
  );
}

function Bar({ label, avg }: { label: string; avg: number }): React.ReactElement {
  const percent = Math.max(0, Math.min(100, (avg / 5) * 100)); // assume max=5 for bar length; tooltip shows real avg
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
        <span className="truncate">{label}</span>
        <span>{avg.toFixed(2)}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-black transition-all"
          style={{ width: `${percent}%` }}
          title={`avg ${avg.toFixed(2)}`}
        />
      </div>
    </div>
  );
}
