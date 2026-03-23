'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

export default function EditCategory() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && id) {
      fetchCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${id}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError('Failed to load category');
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
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update category');
      }

      router.push('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--paper)] border border-[var(--border)] p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[var(--ink)]">
              Edit Category
            </h1>
            <Link
              href="/admin/categories"
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

        <form onSubmit={handleSubmit} className="bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-[var(--ink)] mb-2">
              ID (Cannot be changed)
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              readOnly
              disabled
              className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink-light)]"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--ink)] mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
              Icon (Emoji) *
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
            />
            <p className="text-sm text-[var(--ink-light)] mt-1">
              Use a single emoji character
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[var(--ink)] text-[var(--background)] py-3 px-4 font-semibold hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/categories"
              className="px-6 py-3 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition text-center cursor-pointer"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
