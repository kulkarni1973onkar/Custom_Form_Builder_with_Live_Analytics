'use client';
import * as React from 'react';
import Card from '@/components/UI/Card';
import { Send } from 'lucide-react';

type OllamaPanelProps = {
  onSend?: (question: string) => void;
  insight?: string;
};

export default function OllamaPanel({ onSend, insight }: OllamaPanelProps) {
  const [query, setQuery] = React.useState('');
  const [history, setHistory] = React.useState<{ from: 'user' | 'ollama'; text: string }[]>([]);

  const handleSend = () => {
    if (!query.trim()) return;
    setHistory((prev) => [...prev, { from: 'user', text: query.trim() }]);
    onSend?.(query.trim());
    setQuery('');
  };

  React.useEffect(() => {
    if (!insight) return;
    setHistory((prev) => [...prev, { from: 'ollama', text: insight }]);
  }, [insight]);

  return (
    <Card className="space-y-4 p-5 border border-sky-500/30 bg-slate-950/60 shadow-lg">
      <div>
        <p className="text-sm font-semibold text-sky-400">Ollama AI Insights</p>
        <p className="text-xs text-slate-400">Ask the analytics AI for trends, predictions, and recommendations.</p>
      </div>

      <div className="h-56 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/40 p-3">
        {history.length === 0 ? (
          <p className="text-xs text-slate-500">Ask a question and let the AI summarize your analytics data.</p>
        ) : (
          <div className="space-y-2">
            {history.map((item, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 ${item.from === 'user' ? 'bg-indigo-950 text-sky-100' : 'bg-slate-800 text-slate-200'}`}
              >
                <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">{item.from === 'user' ? 'You' : 'Ollama'}</div>
                <div>{item.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' ? handleSend() : undefined)}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          placeholder="eg. Show me the top 3 low-scoring questions"
          aria-label="Ollama analytics question"
        />
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-sky-500 px-3 text-white transition hover:bg-sky-400"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
