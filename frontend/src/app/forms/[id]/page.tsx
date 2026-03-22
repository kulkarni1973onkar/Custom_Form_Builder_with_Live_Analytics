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
import Breadcrumbs from '@/components/Breadcrumbs';
import Loading from '@/components/Loading';
import { Button } from '@/components/UI/Button';
import {
  Edit3,
  Eye,
  Share2,
  Copy,
  Code,
  ExternalLink,
  BarChart3,
  Settings,
  Save,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function EditFormPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const { draft, actions } = useFormDraft();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);

  // Load form
  React.useEffect(() => {
    let mounted = true;
    api
      .getForm(id)
      .then((form) => {
        if (mounted && form) actions.seed(form);
      })
      .catch((error) => {
        console.error('Error loading form:', error);
        if (mounted) push('error', 'Failed to load form');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id, actions, push]);

  const onSave = async (silent = false) => {
    if (saving) return;

    setSaving(true);
    try {
      await api.updateForm(id, trimAll(draft));
      if (!silent) push('success', 'Form saved successfully');
    } catch (error) {
      console.error('Error saving form:', error);
      if (!silent) push('error', 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const onPublish = async () => {
    if (publishing) return;

    setPublishing(true);
    try {
      const pub = await api.publishForm(id);
      if (pub.slug) {
        actions.meta({ status: 'published', slug: pub.slug });
        push('success', 'Form published successfully!');
      } else {
        push('error', 'Failed to publish form');
      }
    } catch (error) {
      console.error('Error publishing form:', error);
      push('error', 'Failed to publish form');
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      push('success', successMessage);
    } catch (error) {
      push('error', 'Failed to copy to clipboard');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-[600px] w-full" />
              </div>
              <div>
                <Skeleton className="h-[600px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/public/${draft.slug}`
    : `/public/${draft.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {draft.title || 'Untitled Form'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Edit your form and manage responses
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="hidden sm:flex"
              >
                {previewMode ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/forms/${id}/analytics`}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Published Form Info */}
        {draft.slug && draft.status === 'published' && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Form is live</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Accessible at{' '}
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {publicUrl}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(publicUrl, 'Link copied to clipboard')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(
                    `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`,
                    'Embed code copied'
                  )}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Embed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Loading States */}
        {(saving || publishing) && (
          <div className="mb-6">
            <Loading text={saving ? "Saving changes..." : "Publishing form..."} />
          </div>
        )}

        {/* Form Builder / Preview */}
        <div className={previewMode ? "grid grid-cols-1 xl:grid-cols-2 gap-8" : ""}>
          <div className={previewMode ? "order-2" : ""}>
            <BuilderShell
              draft={draft}
              onMeta={actions.meta}
              onAdd={actions.add}
              onUpdate={actions.update}
              onRemove={actions.remove}
              onReorder={actions.reorder}
              onSave={() => onSave(false)}
              onPublish={onPublish}
              disabled={saving || publishing}
            />
          </div>

          {previewMode && (
            <div className="order-1">
              <Card className="sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Live Preview</h3>
                </div>
                <div className="max-h-[600px] overflow-auto border rounded-lg p-4 bg-muted/30">
                  <FormRenderer
                    schema={draft}
                    onSubmit={async (answers: any) => {
                      console.log('Preview submission:', answers);
                      push('success', 'Preview submission successful (not saved)');
                    }}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
