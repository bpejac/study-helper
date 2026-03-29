'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from './Button';
import Card from './Card';
import Modal from './editor/Modal';
import CategoryForm, { CategoryFormValues } from './editor/CategoryForm';

export default function AddCategoryCard() {
  const { status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CategoryFormValues>({
    id: '',
    name: '',
    description: '',
    icon: '',
  });

  if (status !== 'authenticated') {
    return null;
  }

  const resetAndCloseModal = () => {
    setIsOpen(false);
    setError('');
    setFormData({
      id: '',
      name: '',
      description: '',
      icon: '',
    });
  };

  const handleCloseModal = () => {
    if (loading) return;
    resetAndCloseModal();
  };

  const handleChange = (field: keyof CategoryFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create subject');
      }

      resetAndCloseModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card as="button" type="button" onClick={() => setIsOpen(true)} className="group p-6 h-full flex items-center justify-center !bg-transparent border-2 border-dashed hover:!bg-[var(--paper)]">
        <div className="text-center">
          <div className="text-4xl text-[var(--ink-light)] group-hover:text-[var(--accent)] transition-colors">
            +
          </div>
          <p className="text-sm text-[var(--ink-light)] group-hover:text-[var(--accent)] transition-colors mt-2">
            Add Subject
          </p>
        </div>
      </Card>

      <Modal title="Create New Subject" isOpen={isOpen} onClose={handleCloseModal}>
        <CategoryForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Create Subject"
          loadingLabel="Creating..."
          loading={loading}
          error={error}
          idPrefix="new"
          showId
          secondaryAction={
            <Button type="button" size="md" onClick={handleCloseModal} disabled={loading} className="flex-1">
              Cancel
            </Button>
          }
        />
      </Modal>
    </>
  );
}
