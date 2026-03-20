'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export default function CategoriesManagement() {
  const { status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCategories();
    }
  }, [status]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated topics.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');
      
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete category');
      console.error(err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink)] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[var(--ink)]">
                Manage Categories
              </h1>
              <p className="text-[var(--ink-light)] mt-1">
                {categories.length} {categories.length === 1 ? 'category' : 'categories'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--code-bg)] transition cursor-pointer"
              >
                ← Back
              </Link>
              <Link
                href="/admin/categories/new"
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                + Add Category
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Categories List */}
        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                      {category.name}
                    </h3>
                    <p className="text-[var(--ink-light)] text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-[var(--paper)] text-[var(--ink-light)] px-2 py-1 border border-[var(--border)]">
                        ID: {category.id}
                      </span>

                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/admin/topics?categoryId=${category.id}&from=categories`}
                    className="px-4 py-2 border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--paper)] transition cursor-pointer text-sm"
                  >
                    View Topics
                  </Link>
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="px-4 py-2 border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--paper)] transition cursor-pointer text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {categories.length === 0 && !loading && (
            <div className="border border-[var(--border)] p-12 text-center">
              <p className="text-[var(--ink-light)] text-lg mb-4">
                No categories found
              </p>
              <Link
                href="/admin/categories/new"
                className="inline-block px-6 py-3 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                Create Your First Category
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
