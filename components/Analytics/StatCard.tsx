'use client';
import * as React from 'react';
import Card from '@/components/UI/Card';

export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}): React.ReactElement {
  return (
    <Card className="border-2 border-slate-700 bg-slate-950/60 p-5 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      </div>
    </Card>
  );
}
