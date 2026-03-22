'use client';
import * as React from 'react';
import { useParams } from 'next/navigation';
import { useFormDraft } from '@/hooks/useFormDraft';
import { api } from '@/lib/api';
import BuilderShell from '@/components/FormBuilder/BuilderShell';
import FormRenderer from '@/components/FormRenderer/FormRenderer';
import Card from '@/components/UI/Card';
import Skeleton from '@/components/UI/Skeleton';
import { trimAll } from '@/lib/sanitize';
import { useToast } from '@/hooks/useToast';
import { ThemeToggle } from '@/components/UI/ThemeToggle';

export default function EditFormPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const { draft, actions } = useFormDraft();
  const [loading, setLoading] = React.useState(true);

  // Load form
  React.useEffect(() => {
    let mounted = true;
    api
      .getForm(id)
      .then((form) => {
        if (mounted && form) actions.seed(form);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id, actions]);

  const onSave = async (silent = false) => {
    try {
      await api.updateForm(id, trimAll(draft));
      if (!silent) push('success', 'Saved');
    } catch {
      if (!silent) push('error', 'Save failed');
    }
  };

  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (loading) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const t = setTimeout(() => {
      void onSave(true);
    }, 2000);

    return () => clearTimeout(t);
  }, [draft, loading]);

  const onPublish = async () => {
    try {
      const pub = await api.publishForm(id);
      if (pub.slug) {
        actions.meta({ status: 'published', slug: pub.slug });
        push('success', 'Published');
      } else {
        push('error', 'Publish failed');
      }
    } catch {
      push('error', 'Publish failed');
    }
  };

  const [previewMode, setPreviewMode] = React.useState(false);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="mt-4 h-40 w-full" />
      </div>
    );
  }

  return (
    <div className={previewMode ? "max-w-[1600px] w-full mx-auto p-4" : "max-w-5xl mx-auto p-4"}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Edit form</h1>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {previewMode ? "Close Preview" : "Split-screen Preview"}
          </button>
        </div>
      </div>

      {draft.slug && draft.status === 'published' && (
        <Card className="mb-4 text-sm flex justify-between items-center px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
          <div>
            <b>Live at:</b> <a className="text-blue-600 dark:text-blue-400 font-medium ml-1 hover:underline" href={`/public/${draft.slug}`} target="_blank">
              {typeof window !== 'undefined' ? window.location.origin : ''}/public/{draft.slug}
            </a>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white dark:bg-gray-800 border rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 font-medium" onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/public/${draft.slug}`);
              push('success', 'Link copied to clipboard');
            }}>Copy Link</button>
            <button className="px-3 py-1 bg-white dark:bg-gray-800 border rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 font-medium" onClick={() => {
              const iframe = `<iframe src="${window.location.origin}/public/${draft.slug}" width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
              navigator.clipboard.writeText(iframe);
              push('success', 'Iframe code copied');
            }}>Copy Embed</button>
          </div>
        </Card>
      )}

      <div className={previewMode ? "grid grid-cols-[1fr_1fr] gap-8" : ""}>
        <div className={previewMode ? "overflow-auto pr-4 border-r" : ""}>
          <BuilderShell
            draft={draft}
            onMeta={actions.meta}
            onAdd={actions.add}
            onUpdate={actions.update}
            onRemove={actions.remove}
            onReorder={actions.reorder}
            onSave={() => onSave(false)}
            onPublish={onPublish}
          />
        </div>
        
        {previewMode && (
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4 h-[calc(100vh-8rem)] overflow-auto">
            <h2 className="text-lg font-medium mb-4 text-gray-500">Live Preview</h2>
            <FormRenderer
              schema={draft}
              onSubmit={async (ans: any) => {
                push('success', 'Preview submission successful (not saved to DB)');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
