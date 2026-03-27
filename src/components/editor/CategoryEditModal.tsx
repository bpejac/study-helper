'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '@/components/Button';
import type { Category } from '@/types';
import CategoryForm, { CategoryFormValues } from './CategoryForm';
import Modal from './Modal';

interface CategoryEditModalProps {
  category: Category;
}

export default function CategoryEditModal({ category }: CategoryEditModalProps) {
  const { status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CategoryFormValues>({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
  });

  if (status !== 'authenticated') {
    return null;
  }

  const handleChange = (field: keyof CategoryFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this category and all of its topics?');
    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      router.push('/categories');
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
      <Button size="sm" onClick={() => setIsEditOpen(true)}>
        Edit
      </Button>

      <Modal title="Edit Category" isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <CategoryForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Save Category"
          loadingLabel="Saving..."
          loading={saving}
          error={error}
          idPrefix="edit"
          dangerAction={
            <Button type="button" tone="danger" size="md" disabled={saving} onClick={handleDelete} className="w-full">
              Delete Category
            </Button>
          }
        />
      </Modal>
    </>
  );
}
