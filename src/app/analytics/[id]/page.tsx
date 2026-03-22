'use client';
import * as React from 'react';
import { useParams } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';
import Card from '@/components/UI/Card';
import Skeleton from '@/components/UI/Skeleton';
import StatCard from '@/components/Analytics/StatCard';
import RatingsChart from '@/components/Analytics/RatingsChart';
import OptionsBar from '@/components/Analytics/OptionsBar';
import RealtimeIndicator from '@/components/Analytics/RealtimeIndicator';
import OllamaPanel from '@/components/Analytics/OllamaPanel';

interface FieldData {
  fieldId: string;
  label?: string;
  type: string;
  histogram?: Array<{ score: number; count: number }>;
  distribution?: Array<{ optionId: string; count: number }>;
}

export default function AnalyticsPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { snapshot, status } = useAnalytics(id);

  if (!snapshot) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-3 h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">Live insights for form id {id}</p>
          </div>
          <RealtimeIndicator state={status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total responses"
          value={snapshot.totalResponses}
          hint={`Updated ${new Date(snapshot.updatedAt).toLocaleTimeString()}`}
        />
        <StatCard
          label="Active fields"
          value={snapshot.fields.length}
          hint="Including all question types"
        />
        <StatCard
          label="Last updated"
          value={new Date(snapshot.updatedAt).toLocaleTimeString()}
          hint="Realtime refresh"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 grid gap-4 md:grid-cols-2">
          {snapshot.fields
            .filter((f) => f.type === 'rating')
            .map((f: FieldData) => (
              <Card key={f.fieldId} className="bg-slate-900/60 p-4 border border-slate-700">
                <h3 className="mb-2 text-sm font-semibold text-slate-200">{f.label ?? f.fieldId}</h3>
                <RatingsChart
                  data={(f.histogram || []).map((h) => ({
                    score: String(h.score),
                    count: h.count,
                  }))}
                />
              </Card>
            ))}

          {snapshot.fields
            .filter((f) => f.type === 'multiple' || f.type === 'checkbox')
            .map((f: FieldData) => (
              <Card key={f.fieldId} className="bg-slate-900/60 p-4 border border-slate-700">
                <h3 className="mb-2 text-sm font-semibold text-slate-200">{f.label ?? f.fieldId}</h3>
                <OptionsBar
                  data={(f.distribution || []).map((d) => ({
                    label: d.optionId,
                    count: d.count,
                  }))}
                />
              </Card>
            ))}
        </div>

        <OllamaPanel
          insight="Based on the current dataset, your lowest scoring question is likely to be improved by choosing clearer wording and reducing optional answer complexity."
          onSend={(question) => {
            // `onSend` can call a real endpoint later (e.g., /api/ollama/?question=...)
            console.log('Ollama question:', question);
          }}
        />
      </div>
    </div>
  );
}
