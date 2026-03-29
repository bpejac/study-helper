'use client';

import { useCallback, useState } from 'react';
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

  const closeEditModal = useCallback(() => {
    setIsEditOpen(false);
  }, []);

  const openEditModal = useCallback(() => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setError('');
    setIsEditOpen(true);
  }, [category.description, category.icon, category.id, category.name]);

  if (status !== 'authenticated') {
    return null;
  }

  const handleChange = (field: keyof CategoryFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this subject and all of its topics?');
    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete subject');
      }
      router.push('/categories');
      router.refresh();
    } catch {
      setError('Failed to delete subject');
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
        throw new Error(data.error || 'Failed to update subject');
      }

      setIsEditOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subject');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={openEditModal}>
        Edit
      </Button>

      <Modal title="Edit Subject" isOpen={isEditOpen} onClose={closeEditModal}>
        <CategoryForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Save Subject"
          loadingLabel="Saving..."
          loading={saving}
          error={error}
          idPrefix="edit"
          dangerAction={
            <Button type="button" tone="danger" size="md" disabled={saving} onClick={handleDelete} className="w-full">
              Delete Subject
            </Button>
          }
        />
      </Modal>
    </>
  );
}
