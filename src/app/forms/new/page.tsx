'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFormDraft } from '@/hooks/useFormDraft';
import BuilderShell from '@/components/FormBuilder/BuilderShell';
import { api } from '@/lib/api';
import { trimAll } from '@/lib/sanitize';
import Card from '@/components/UI/Card';
import Breadcrumbs from '@/components/Breadcrumbs';
import Loading from '@/components/Loading';
import { useToast } from '@/hooks/useToast';
import { FileText, Sparkles } from 'lucide-react';

export default function NewFormPage() {
  const router = useRouter();
  const { push } = useToast();
  const { draft, actions } = useFormDraft();
  const [isCreating, setIsCreating] = React.useState(false);

  const onSave = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const created = await api.createForm(trimAll({ ...draft, status: 'draft' }));
      if (created?._id) {
        push('success', 'Form created successfully!');
        router.push(`/forms/${created._id}`);
      } else {
        push('error', 'Failed to create form');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      push('error', 'Failed to create form. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const onPublish = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      // First create then publish if needed
      const created = await api.createForm(trimAll({ ...draft, status: 'draft' }));
      if (!created?._id) {
        push('error', 'Failed to create form');
        return;
      }

      const pub = await api.publishForm(created._id);
      if (pub.slug) {
        push('success', 'Form created and published!');
        router.push(`/forms/${pub._id}`);
      } else {
        push('error', 'Form created but failed to publish');
        router.push(`/forms/${created._id}`);
      }
    } catch (error) {
      console.error('Error creating/publishing form:', error);
      push('error', 'Failed to create and publish form. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs />
          <div className="flex items-center gap-3 mt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Form</h1>
              <p className="text-muted-foreground mt-1">
                Build a custom form with conditional logic and real-time analytics
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6 border-dashed">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Build your form on the left and add fields from the right palette. Use conditional logic to create dynamic experiences,
                and preview your form in real-time. When ready, save as draft or publish directly.
              </p>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isCreating && (
          <div className="mb-6">
            <Loading text="Creating your form..." />
          </div>
        )}

        {/* Form Builder */}
        <BuilderShell
          draft={draft}
          onMeta={actions.meta}
          onAdd={actions.add}
          onUpdate={actions.update}
          onRemove={actions.remove}
          onReorder={actions.reorder}
          onSave={onSave}
          onPublish={onPublish}
          disabled={isCreating}
        />
      </div>
    </div>
  );
}
