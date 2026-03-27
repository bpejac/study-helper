'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '@/components/Button';
import type { Topic, Category } from '@/types';
import Modal from './Modal';
import MarkdownEditor from './MarkdownEditor';

const confidenceValues: Topic['confidence'][] = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
];

interface TopicEditModalProps {
  topic: Topic;
}

export default function TopicEditModal({ topic }: TopicEditModalProps) {
  const { status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: topic.title,
    description: topic.description,
    icon: topic.icon || '',
    categoryId: topic.categoryId,
    confidence: topic.confidence,
  });

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => undefined);
  }, [status]);

  if (status !== 'authenticated') {
    return null;
  }

  const openModal = () => {
    setFormData({
      title: topic.title,
      description: topic.description,
      icon: topic.icon || '',
      categoryId: topic.categoryId,
      confidence: topic.confidence,
    });
    setError('');
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update topic');
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update topic');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this topic?');
    if (!confirmed) return;

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/topics/${topic.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete topic');
      }
      router.push(`/categories/${topic.categoryId}`);
      router.refresh();
    } catch {
      setError('Failed to delete topic');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Edit
      </Button>

      <Modal title="Edit Topic" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <p className="text-sm text-[var(--accent)]">{error}</p>}
          <div>
            <label className="block text-sm text-[var(--ink)] mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)]"
              required
            />
          </div>
          <MarkdownEditor
            id="topic-description"
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
            rows={4}
            required
          />
          <div>
            <label className="block text-sm text-[var(--ink)] mb-1">Icon</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)]"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--ink)] mb-1">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)]"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--ink)] mb-1">Confidence</label>
            <select
              value={formData.confidence}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, confidence: e.target.value as Topic['confidence'] }))
              }
              className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)]"
              required
            >
              {confidenceValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" tone="primary" size="md" disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Topic'}
          </Button>
          <Button type="button" tone="danger" size="md" disabled={saving} onClick={handleDelete} className="w-full">
            Delete Topic
          </Button>
        </form>
      </Modal>
    </>
  );
}
