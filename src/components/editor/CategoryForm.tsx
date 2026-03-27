'use client';

import Button from '@/components/Button';
import MarkdownEditor from './MarkdownEditor';

export interface CategoryFormValues {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CategoryFormProps {
  formData: CategoryFormValues;
  onChange: (field: keyof CategoryFormValues, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  loadingLabel: string;
  loading: boolean;
  error?: string;
  idPrefix: string;
  showId?: boolean;
  secondaryAction?: React.ReactNode;
  dangerAction?: React.ReactNode;
}

export default function CategoryForm({
  formData,
  onChange,
  onSubmit,
  submitLabel,
  loadingLabel,
  loading,
  error,
  idPrefix,
  showId = false,
  secondaryAction,
  dangerAction,
}: CategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-sm text-[var(--accent)]">{error}</p>}

      {showId && (
        <div>
          <label htmlFor={`${idPrefix}-category-id`} className="block text-sm text-[var(--ink)] mb-1">
            ID (URL-friendly identifier)
          </label>
          <input
            type="text"
            id={`${idPrefix}-category-id`}
            name="id"
            value={formData.id}
            onChange={(e) => onChange('id', e.target.value)}
            required
            placeholder="e.g., programming-languages"
            className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
          />
        </div>
      )}

      <div>
        <label htmlFor={`${idPrefix}-category-name`} className="block text-sm text-[var(--ink)] mb-1">
          Name
        </label>
        <input
          type="text"
          id={`${idPrefix}-category-name`}
          name="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
          placeholder="e.g., Programming Languages"
          className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
        />
      </div>

      <MarkdownEditor
        id={`${idPrefix}-category-description`}
        name="description"
        label="Description"
        value={formData.description}
        onChange={(value) => onChange('description', value)}
        rows={3}
        required
        placeholder="Brief description of this category"
      />

      <div>
        <label htmlFor={`${idPrefix}-category-icon`} className="block text-sm text-[var(--ink)] mb-1">
          Icon (Emoji)
        </label>
        <input
          type="text"
          id={`${idPrefix}-category-icon`}
          name="icon"
          value={formData.icon}
          onChange={(e) => onChange('icon', e.target.value)}
          required
          placeholder="e.g., 💻"
          className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" tone="primary" size="md" disabled={loading} className="flex-1">
          {loading ? loadingLabel : submitLabel}
        </Button>
        {secondaryAction}
      </div>

      {dangerAction}
    </form>
  );
}