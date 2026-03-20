'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

interface Category {
  id: string;
  name: string;
}

export default function EditTopic() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    icon: '',
    categoryId: '',
    confidence: 'beginner',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, id]);

  const fetchData = async () => {
    try {
      const [categoriesRes, topicRes] = await Promise.all([
        fetch('/api/categories'),
        fetch(`/api/topics/${id}`),
      ]);

      if (!categoriesRes.ok || !topicRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const categoriesData = await categoriesRes.json();
      const topicData = await topicRes.json();

      setCategories(categoriesData);
      setFormData({
        id: topicData.id,
        title: topicData.title,
        description: topicData.description,
        icon: topicData.icon || '',
        categoryId: topicData.categoryId,
        confidence: topicData.confidence,
      });
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update topic');
      }

      router.push('/admin/topics');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update topic');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink)] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--paper)] border border-[var(--border)] p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[var(--ink)]">Edit Topic</h1>
            <Link
              href="/admin/topics"
              className="px-4 py-2 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition cursor-pointer"
            >
              ← Back
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[var(--border)] bg-[var(--paper)]">
            <p className="text-[var(--ink)]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6">
            <h2 className="text-xl font-bold text-[var(--ink)]">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-[var(--ink)] mb-2">
                ID (Cannot be changed)
              </label>
              <input
                type="text"
                value={formData.id}
                readOnly
                disabled
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink-light)]"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--ink)] mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
              />
            </div>

            <div>
              <MarkdownEditor
                id="description"
                name="description"
                label="Description *"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                required
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-[var(--ink)] mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-[var(--ink)] mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] cursor-pointer"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="confidence" className="block text-sm font-medium text-[var(--ink)] mb-2">
                Confidence Level *
              </label>
              <select
                id="confidence"
                name="confidence"
                value={formData.confidence}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] cursor-pointer"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[var(--ink)] text-[var(--background)] py-3 px-4 font-semibold hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin/topics"
                className="px-6 py-3 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition text-center cursor-pointer"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
