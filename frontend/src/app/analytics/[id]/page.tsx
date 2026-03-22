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
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <RealtimeIndicator state={status} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total responses"
          value={snapshot.totalResponses}
          hint={`Updated ${new Date(snapshot.updatedAt).toLocaleTimeString()}`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {snapshot.fields
          .filter((f) => f.type === 'rating')
          .map((f: any) => (
            <Card key={f.fieldId} className="p-4">
              <h3 className="mb-3 font-medium text-gray-700 text-sm">Field: {f.fieldId}</h3>
              <RatingsChart
                data={(f.histogram || []).map((h: any) => ({
                  score: String(h.score),
                  count: h.count,
                }))}
              />
            </Card>
          ))}
        {snapshot.fields
          .filter((f) => f.type === 'multiple' || f.type === 'checkbox')
          .map((f: any) => (
            <Card key={f.fieldId} className="p-4">
              <h3 className="mb-3 font-medium text-gray-700 text-sm">Field: {f.fieldId}</h3>
              <OptionsBar
                data={(f.distribution || []).map((d: any) => ({
                  label: d.optionId,
                  count: d.count,
                }))}
              />
            </Card>
          ))}
      </div>
    </div>
  );
}
