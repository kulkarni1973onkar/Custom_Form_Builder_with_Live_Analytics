'use client';
import * as React from 'react';

export default function RealtimeIndicator({ state }: { state: 'idle' | 'live' | 'reconnecting' }): React.ReactElement {
  const color =
    state === 'live' ? 'bg-emerald-400/90' : state === 'reconnecting' ? 'bg-amber-300/90' : 'bg-slate-400/80';
  const label = state === 'live' ? 'Live' : state === 'reconnecting' ? 'Reconnecting…' : 'Idle';

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs font-semibold text-slate-100 shadow-sm backdrop-blur-sm">
      <span className={`h-2 w-2 animate-pulse rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
