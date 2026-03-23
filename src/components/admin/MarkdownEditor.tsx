'use client';

import Markdown from '@/components/Markdown';

interface MarkdownEditorProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  helperText?: string;
}

export default function MarkdownEditor({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  helperText,
}: MarkdownEditorProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--ink)] mb-2">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] font-mono text-sm"
      />
      {helperText && <p className="text-sm text-[var(--ink-light)] mt-1">{helperText}</p>}

      <div className="mt-3 border border-[var(--border)] bg-[var(--paper)]">
        <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--code-bg)] text-xs font-medium uppercase tracking-wider text-[var(--ink-light)]">
          Preview
        </div>
        <div className="px-4 py-3 text-sm text-[var(--ink)] leading-relaxed">
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <span className="text-[var(--ink-light)] italic">No markdown content yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}
