'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Card from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import Skeleton from '@/components/UI/Skeleton';
import { FormSchema } from '@/lib/types';
import RealtimeIndicator from '@/components/Analytics/RealtimeIndicator';
import StatCard from '@/components/Analytics/StatCard';
import RatingsChart from '@/components/Analytics/RatingsChart';
import OptionsBar from '@/components/Analytics/OptionsBar';

interface RatingData {
  _id: string;
  avg: number;
}

interface OptionCount {
  _id: { fieldId: string; option: string };
  count: number;
}

interface AnalyticsStats {
  totalResponses: number;
  ratings?: RatingData[];
  optionCounts?: OptionCount[];
}

interface ResponseData {
  submittedAt: string;
  answers?: Array<{
    fieldId: string;
    value: string | string[];
  }>;
}

export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const [schema, setSchema] = React.useState<FormSchema | null>(null);
  const [stats, setStats] = React.useState<AnalyticsStats | null>(null); // The backend returns { totalResponses, ratings, optionCounts }
  const [isConnected, setIsConnected] = React.useState(false);

  // Fetch form schema
  React.useEffect(() => {
    api.getForm(id).then(setSchema).catch(console.error);
  }, [id]);

  // Connect WebSocket
  React.useEffect(() => {
    const wsUrl = `ws://localhost:8080/ws/forms/${id}/analytics`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setIsConnected(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.totalResponses !== undefined) {
          setStats(data);
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };
    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, [id]);

  if (!schema) {
    return <div className="p-4"><Skeleton className="h-10 w-full max-w-lg mb-4" /><Skeleton className="h-40 w-full" /></div>;
  }

  const exportCSV = () => {
    // In a real app we would paginate or fetch from a dedicated CSV endpoint.
    // Assuming backend endpoint /api/forms/:id/responses for full dump
    fetch(`http://localhost:8080/api/forms/${id}/responses`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        // Convert to CSV
        if (!data || !data.length) return alert("No responses to export.");
        const headers = ['Submitted At', ...schema.fields.map(f => f.label)];
        const rows = data.map((res: ResponseData) => {
          const row = [res.submittedAt];
          schema.fields.forEach(f => {
            const ans = res.answers?.find((a) => a.fieldId === f.id);
            row.push(ans ? (Array.isArray(ans.value) ? ans.value.join('; ') : String(ans.value)) : '');
          });
          return row;
        });
        
        const csvContent = "data:text/csv;charset=utf-8," 
          + [headers.join(','), ...rows.map((r: string[]) => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${schema.slug || 'form'}_responses.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => alert("Export failed: " + err));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{schema.title} Analytics</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            Status: <RealtimeIndicator state={isConnected ? "live" : "idle"} />
          </p>
        </div>
        <Button onClick={exportCSV}>Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Responses" value={stats?.totalResponses ?? 0} />
        {/* Placeholder for completion rate / avg time, needs backend support */}
        <StatCard label="Completion Rate" value="95%" hint="+2% this week" />
        <StatCard label="Avg Time to Complete" value="1m 30s" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {schema.fields.map(field => {
          if (field.type === 'rating') {
            const hist = stats?.ratings?.find((r: RatingData) => r._id === field.id);
            return (
              <Card key={field.id} className="p-4">
                <h3 className="font-semibold mb-2">{field.label}</h3>
                <div className="text-sm text-gray-500 mb-4">Average: {hist?.avg ? hist.avg.toFixed(1) : '-'}</div>
                <RatingsChart data={hist ? [{ score: 'Avg', count: hist.avg }] : []} />
              </Card>
            );
          }
          if (field.type === 'multiple' || field.type === 'checkbox') {
            const distribution = stats?.optionCounts
              ?.filter((o: OptionCount) => o._id.fieldId === field.id)
              .map((o: OptionCount) => ({ optionId: o._id.option, count: o.count })) || [];
              
            // map optionId to label
            const enrichedDist = distribution.map((d) => {
              const opt = field.options.find(opt => opt.id === d.optionId || opt.value === d.optionId);
              return { label: opt ? opt.label : d.optionId, count: d.count };
            });

            return (
              <Card key={field.id} className="p-4">
                <h3 className="font-semibold mb-4">{field.label}</h3>
                <OptionsBar data={enrichedDist} />
              </Card>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
