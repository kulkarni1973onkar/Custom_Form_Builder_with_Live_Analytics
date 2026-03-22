'use client';
import * as React from 'react';
import Card from '@/components/UI/Card';
import { Send, Loader2, Trash2 } from 'lucide-react';

type Message = {
  id: string;
  from: 'user' | 'ollama';
  text: string;
  timestamp: Date;
};

type OllamaPanelProps = {
  onSend?: (question: string) => Promise<void> | void;
  insight?: string;
  error?: string;
  isLoading?: boolean;
};

export default function OllamaPanel({
  onSend,
  insight,
  error,
  isLoading = false
}: OllamaPanelProps) {
  const [query, setQuery] = React.useState('');
  const [history, setHistory] = React.useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = React.useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isSubmitting) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      from: 'user',
      text: query.trim(),
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setIsSubmitting(true);
    setQuery('');

    try {
      await onSend?.(query.trim());
    } catch (err) {
      console.error('Failed to send message:', err);
      // Could add error message to history
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  React.useEffect(() => {
    if (insight) {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        from: 'ollama',
        text: insight,
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, aiMessage]);
    }
  }, [insight]);

  React.useEffect(() => {
    if (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        from: 'ollama',
        text: `Error: ${error}`,
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, errorMessage]);
    }
  }, [error]);

  React.useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  // Limit history to last 50 messages for performance
  React.useEffect(() => {
    if (history.length > 50) {
      setHistory((prev) => prev.slice(-50));
    }
  }, [history]);

  return (
    <Card className="flex flex-col space-y-4 p-4 sm:p-5 border border-sky-500/30 bg-slate-950/60 shadow-lg h-full max-h-[600px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-400">Ollama AI Insights</p>
          <p className="text-xs text-slate-400">Ask the analytics AI for trends, predictions, and recommendations.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        ref={chatRef}
        className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/40 p-3"
        role="log"
        aria-label="Chat history"
        aria-live="polite"
      >
        {history.length === 0 ? (
          <p className="text-xs text-slate-500">Ask a question and let the AI summarize your analytics data.</p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg px-3 py-2 ${
                  item.from === 'user'
                    ? 'bg-indigo-950 text-sky-100 ml-8'
                    : 'bg-slate-800 text-slate-200 mr-8'
                }`}
              >
                <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-400 flex items-center justify-between">
                  <span>{item.from === 'user' ? 'You' : 'Ollama'}</span>
                  <span className="text-[8px] opacity-50">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="whitespace-pre-wrap break-words">{item.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSubmitting || isLoading}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="e.g., Show me the top 3 low-scoring questions"
          aria-label="Ask Ollama analytics question"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!query.trim() || isSubmitting || isLoading}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-sky-500 px-3 text-white transition hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send question"
        >
          {isSubmitting || isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </Card>
  );
}
