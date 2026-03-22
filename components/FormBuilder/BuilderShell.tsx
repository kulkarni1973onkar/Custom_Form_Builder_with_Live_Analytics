'use client';
import * as React from 'react';
import Card from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Switch from '@/components/UI/Switch';
import { Field, FieldType, FormSchema, MultipleField, CheckboxField, RatingField, TextField } from '@/lib/types';
import { validateSchema } from '@/lib/validators';
import { useToast } from '@/hooks/useToast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

type Props = {
  draft: FormSchema;
  onMeta: (patch: Partial<Pick<FormSchema, 'title' | 'slug' | 'status' | 'description'>>) => void;
  onAdd: (type: FieldType) => void;
  onUpdate: (id: string, patch: Partial<Field>) => void;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onSave: () => Promise<void> | void;
  onPublish: () => Promise<void> | void;
};

export default function BuilderShell({
  draft,
  onMeta,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
  onSave,
  onPublish,
}: Props) {
  const { push } = useToast();

  function trySave() {
    const errs = validateSchema(draft.fields);
    if (errs.length) {
      push('error', `Fix ${errs.length} issue(s) before saving`);
      return;
    }
    void onSave();
    push('success', 'Draft saved');
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = draft.fields.findIndex(f => f.id === active.id);
      const newIndex = draft.fields.findIndex(f => f.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  }

  function tryPublish() {
    const errs = validateSchema(draft.fields);
    if (errs.length) {
      push('error', `Fix ${errs.length} issue(s) before publishing`);
      return;
    }
    void onPublish();
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      {/* LEFT: field list */}
      <div className="space-y-4">
        <Card>
          <div className="grid gap-3">
            <Input
              label="Form title"
              value={draft.title}
              onChange={(e) => onMeta({ title: e.currentTarget.value })}
              placeholder="Untitled form"
            />
            <Input
              label="Slug (public URL)"
              hint="Generated when you publish; you can customize"
              value={draft.slug ?? ''}
              onChange={(e) => onMeta({ slug: e.currentTarget.value })}
              placeholder="my-customer-feedback"
            />
            <Input
              label="Description"
              value={draft.description ?? ''}
              onChange={(e) => onMeta({ description: e.currentTarget.value })}
              placeholder="Short note shown on the public page"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status: <b>{draft.status}</b></span>
              <Switch
                checked={draft.status === 'published'}
                onChange={(v) => onMeta({ status: v ? 'published' : 'draft' })}
                label="Published"
              />
            </div>
          </div>
        </Card>

        {/* Fields */}
        {draft.fields.length === 0 ? (
          <Card className="text-center py-10 text-gray-600">No fields yet. Add one on the right →</Card>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draft.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              {draft.fields.map((f, idx) => (
                <FieldEditorRow
                  key={f.id}
                  field={f}
                  index={idx}
                  total={draft.fields.length}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        <div className="flex gap-2">
          <Button onClick={trySave}>Save draft</Button>
          <Button variant="ghost" onClick={tryPublish}>Publish</Button>
        </div>
      </div>

      {/* RIGHT: add palette */}
      <div className="space-y-4">
        <Card>
          <h3 className="mb-2 text-sm font-semibold text-gray-800">Add field</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => onAdd('text')}>Text</Button>
            <Button onClick={() => onAdd('multiple')}>Multiple Choice</Button>
            <Button onClick={() => onAdd('checkbox')}>Checkboxes</Button>
            <Button onClick={() => onAdd('rating')}>Rating</Button>
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-semibold text-gray-800">Shortcuts</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Use ↑ / ↓ buttons to reorder</li>
            <li>Required toggle per field</li>
            <li>Options editor supports add/remove</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Row + per-type editors ---------------- */

function FieldEditorRow({
  field,
  index: _index,
  total: _total,
  onUpdate,
  onRemove,
}: {
  field: Field;
  index: number;
  total: number;
  onUpdate: (id: string, patch: Partial<Field>) => void;
  onRemove: (id: string) => void;

}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <div className="flex items-start gap-3">
          <div {...attributes} {...listeners} className="cursor-grab hover:text-gray-900 text-gray-400 mt-2">
            <GripVertical size={20} />
          </div>

        <div className="flex-1 space-y-3">
          <div className="grid gap-2">
            <Input
              label="Label"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.currentTarget.value })}
              placeholder="Question title"
            />
            <Input
              label="Help text"
              value={field.helpText ?? ''}
              onChange={(e) => onUpdate(field.id, { helpText: e.currentTarget.value })}
              placeholder="Optional helper shown under the field"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Type: <b>{field.type}</b></span>
              <Switch
                checked={!!field.required}
                onChange={(v) => onUpdate(field.id, { required: v })}
                label="Required"
              />
            </div>
          </div>

          {/* Per-type editor */}
          {field.type === 'text' && <TextProps field={field} onUpdate={onUpdate} />}
          {field.type === 'multiple' && <MultipleProps field={field} onUpdate={onUpdate} />}
          {field.type === 'checkbox' && <CheckboxProps field={field} onUpdate={onUpdate} />}
          {field.type === 'rating' && <RatingProps field={field} onUpdate={onUpdate} />}

          {/* Conditions */}
          <div className="pt-2 border-t mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">Logic rules</span>
              <Button size="sm" variant="outline" onClick={() => {
                const arr = field.conditions ? [...field.conditions] : [];
                arr.push({ fieldId: '', operator: 'equals', value: '' });
                onUpdate(field.id, { conditions: arr });
              }}>+ Add rule</Button>
            </div>
            {field.conditions?.map((c, i) => (
              <div key={i} className="flex gap-2 items-center mb-2 text-sm">
                <span>Show if</span>
                <Input value={c.fieldId} placeholder="Field ID" onChange={(e) => {
                  const arr = [...field.conditions!];
                  arr[i].fieldId = e.currentTarget.value;
                  onUpdate(field.id, { conditions: arr });
                }} />
                <select className="border rounded px-2 py-1 bg-background" value={c.operator} onChange={(e) => {
                  const arr = [...field.conditions!];
                  arr[i].operator = e.currentTarget.value as 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
                  onUpdate(field.id, { conditions: arr });
                }}>
                  <option value="equals">==</option>
                  <option value="not_equals">!=</option>
                  <option value="contains">contains</option>
                  <option value="greater_than">&gt;</option>
                  <option value="less_than">&lt;</option>
                </select>
                <Input value={c.value} placeholder="Value" onChange={(e) => {
                  const arr = [...field.conditions!];
                  arr[i].value = e.currentTarget.value;
                  onUpdate(field.id, { conditions: arr });
                }} />
                <Button variant="destructive" size="sm" onClick={() => {
                  const arr = field.conditions!.filter((_, idx) => idx !== i);
                  onUpdate(field.id, { conditions: arr });
                }}>X</Button>
              </div>
            ))}
          </div>
        </div>

          <div>
            <Button variant="destructive" size="sm" onClick={() => onRemove(field.id)}>
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TextProps({ field, onUpdate }: { field: TextField; onUpdate: (id: string, patch: Partial<Field>) => void }) {
  return (
    <div className="grid gap-2">
      <Input
        label="Placeholder"
        value={field.placeholder ?? ''}
        onChange={(e) => onUpdate(field.id, { placeholder: e.currentTarget.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Min length"
          type="number"
          value={field.minLength ?? ''}
          onChange={(e) => onUpdate(field.id, { minLength: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })}
        />
        <Input
          label="Max length"
          type="number"
          value={field.maxLength ?? ''}
          onChange={(e) => onUpdate(field.id, { maxLength: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })}
        />
      </div>
      <Input
        label="Pattern (regex)"
        value={field.pattern ?? ''}
        onChange={(e) => onUpdate(field.id, { pattern: e.currentTarget.value || undefined })}
      />
    </div>
  );
}

function MultipleProps({
  field,
  onUpdate,
}: {
  field: MultipleField;
  onUpdate: (id: string, patch: Partial<Field>) => void;
}) {
  return (
    <div className="grid gap-2">
      <OptionsEditor
        options={field.options}
        onChange={(opts) => onUpdate(field.id, { options: opts })}
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Allow “Other”</span>
        <Switch
          checked={!!field.allowOther}
          onChange={(v) => onUpdate(field.id, { allowOther: v })}
        />
      </div>
    </div>
  );
}
function CheckboxProps({
  field,
  onUpdate,
}: {
  field: CheckboxField;
  onUpdate: (id: string, patch: Partial<Field>) => void;
}) {
  return (
    <div className="grid gap-2">
      <OptionsEditor
        options={field.options}
        onChange={(opts) => onUpdate(field.id, { options: opts })}
      />
    </div>
  );
}

function RatingProps({ field, onUpdate }: { field: RatingField; onUpdate: (id: string, patch: Partial<Field>) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Input
        label="Min"
        type="number"
        value={field.min}
        onChange={(e) => onUpdate(field.id, { min: Number(e.currentTarget.value || 0) })}
      />
      <Input
        label="Max"
        type="number"
        value={field.max}
        onChange={(e) => onUpdate(field.id, { max: Number(e.currentTarget.value || 0) })}
      />
      <Input
        label="Step"
        type="number"
        value={field.step ?? 1}
        onChange={(e) => onUpdate(field.id, { step: Number(e.currentTarget.value || 1) })}
      />
    </div>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: Array<{ id: string; label: string; value: string }>;
  onChange: (opts: Array<{ id: string; label: string; value: string }>) => void;
}) {
  const add = () => {
    const id = Math.random().toString(36).slice(2, 9);
    onChange([...(options ?? []), { id, label: 'Option', value: id }]);
  };
  const update = (id: string, patch: Partial<{ label: string; value: string }>) => {
    onChange(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };
  const remove = (id: string) => {
    onChange(options.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">Options</span>
        <Button size="sm" onClick={add}>Add option</Button>
      </div>
      <div className="space-y-2">
        {options.length === 0 ? (
          <div className="text-sm text-gray-500">No options yet.</div>
        ) : (
          options.map((o) => (
            <div key={o.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
              <Input
                label="Label"
                value={o.label}
                onChange={(e) => update(o.id, { label: e.currentTarget.value })}
              />
              <Input
                label="Value"
                value={o.value}
                onChange={(e) => update(o.id, { value: e.currentTarget.value })}
              />
              <Button variant="destructive" size="sm" onClick={() => remove(o.id)}>Delete</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
