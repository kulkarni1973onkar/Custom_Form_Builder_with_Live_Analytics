'use client';
import * as React from 'react';
import { FormSchema } from '@/lib/types';
import RenderField from '@/components/FormRenderer/RenderField';
import { Button } from '@/components/UI/Button';
import { validateAnswers } from '@/lib/validators';

export default function FormRenderer({ 
  schema, 
  onSubmit 
}: { 
  schema: FormSchema; 
  onSubmit?: (answers: Record<string, any>) => Promise<void>;
}) {
  const [answers, setAnswers] = React.useState<Map<string, any>>(new Map());
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const setAnswer = (id: string, value: any) => {
    const next = new Map(answers);
    next.set(id, value);
    setAnswers(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const answersArr = Array.from(answers.entries()).map(([k, v]) => ({ fieldId: k, value: v }));
    const errs = validateAnswers(schema.fields, answersArr);
    setErrors(errs as Record<string, string>);
    if (Object.keys(errs).length > 0) return;

    if (onSubmit) {
      setSubmitting(true);
      try {
        const payload: Record<string, any> = {};
        for (const [k, v] of answers.entries()) {
          payload[k] = v;
        }
        await onSubmit(payload);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{schema.title}</h1>
        {schema.description && <p className="mt-1 text-gray-600">{schema.description}</p>}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {schema.fields.map((f) => {
          // Evaluate conditions dynamically
          if (f.conditions && f.conditions.length > 0) {
            const isVisible = f.conditions.every((cond) => {
              const val = answers.get(cond.fieldId);
              if (val === undefined || val === null) return false;
              
              const strVal = Array.isArray(val) ? val.join(',') : String(val);
              
              switch (cond.operator) {
                case 'equals': return strVal === cond.value;
                case 'not_equals': return strVal !== cond.value;
                case 'contains': return strVal.includes(cond.value);
                case 'greater_than': return Number(strVal) > Number(cond.value);
                case 'less_than': return Number(strVal) < Number(cond.value);
                default: return false;
              }
            });
            if (!isVisible) return null;
          }

          return (
            <RenderField
              key={f.id}
              field={f}
              value={answers.get(f.id)}
              error={errors[f.id]}
              onChange={(v) => setAnswer(f.id, v)}
            />
          );
        })}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
