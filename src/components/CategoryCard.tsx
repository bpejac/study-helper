'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Category } from '@/types';
import Card from './Card';
import Button from './Button';
import Markdown from './Markdown';
import CategoryForm, { CategoryFormValues } from './editor/CategoryForm';
import Modal from './editor/Modal';

interface CategoryCardProps {
  category: Category;
  topicCount: number;
}

export default function CategoryCard({ category, topicCount }: CategoryCardProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CategoryFormValues>({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
  });

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setError('');
    setIsEditOpen(true);
  };

  const handleChange = (field: keyof CategoryFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = window.confirm('Delete this category and all its topics?');
    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      router.refresh();
    } catch {
      setError('Failed to delete category');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update category');
      }

      setIsEditOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card
        as={Link}
        href={`/categories/${category.id}`}
        className="group p-6 h-full flex flex-col relative"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{category.icon}</span>
          <span className="text-xs text-[var(--ink-light)] font-mono">
            {topicCount} {topicCount === 1 ? 'note' : 'notes'}
          </span>
        </div>

        <h3 className="text-lg font-serif font-semibold text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors">
          {category.name}
        </h3>
        <div className="text-[var(--ink-light)] text-sm leading-relaxed flex-grow">
          <Markdown>{category.description}</Markdown>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--accent)] group-hover:underline">
            Open notebook →
          </span>
        </div>

        {status === 'authenticated' && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button onClick={handleEdit}>Edit</Button>
            <Button tone="danger" disabled={saving} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </Card>

      <Modal title="Edit Category" isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <CategoryForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Save Category"
          loadingLabel="Saving..."
          loading={saving}
          error={error}
          idPrefix={`card-${category.id}`}
        />
      </Modal>
    </>
  );
}
