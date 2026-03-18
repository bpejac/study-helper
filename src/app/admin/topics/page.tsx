'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  title: string;
  categoryId: string;
  confidence: string;
  category: Category;
}

export default function TopicsManagement() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get('categoryId') ?? '';
  const fromCategories = searchParams.get('from') === 'categories';
  const backHref = fromCategories ? '/admin/categories' : '/admin';
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryIdParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selectedCategory]);

  useEffect(() => {
    setSelectedCategory((currentCategory) => {
      return currentCategory === categoryIdParam ? currentCategory : categoryIdParam;
    });
  }, [categoryIdParam]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, topicsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch(selectedCategory ? `/api/topics?categoryId=${selectedCategory}` : '/api/topics'),
      ]);

      if (!categoriesRes.ok || !topicsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const categoriesData = await categoriesRes.json();
      const topicsData = await topicsRes.json();

      setCategories(categoriesData);
      setTopics(topicsData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) {
      return;
    }

    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete topic');

      setTopics(topics.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete topic');
      console.error(err);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);

    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set('categoryId', categoryId);
    } else {
      params.delete('categoryId');
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case 'expert':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'advanced':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'intermediate':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
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
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-[var(--paper)] border border-[var(--border)] p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--ink)]">
                Manage Topics
              </h1>
              <p className="text-[var(--ink-light)] mt-1">
                {topics.length} {topics.length === 1 ? 'topic' : 'topics'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={backHref}
                className="px-4 py-2 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition cursor-pointer"
              >
                ← Back
              </Link>
              <Link
                href="/admin/topics/new"
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                + Add Topic
              </Link>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3">
            <label htmlFor="category-filter" className="text-sm font-medium text-[var(--ink)]">
              Filter by category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[var(--border)] bg-[var(--paper)]">
            <p className="text-[var(--ink)]">{error}</p>
          </div>
        )}

        {/* Topics List */}
        <div className="grid grid-cols-1 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-[var(--paper)] border border-[var(--border)] p-6 hover:border-[var(--ink)] transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {topic.category && (
                      <span className="text-xs border border-[var(--border)] text-[var(--ink)] px-2 py-1">
                        {topic.category.name}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 ${getConfidenceBadgeColor(topic.confidence)}`}>
                      {topic.confidence}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--ink)] mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-light)]">
                    ID: {topic.id}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/admin/topics/${topic.id}`}
                    className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(topic.id)}
                    className="px-4 py-2 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {topics.length === 0 && !loading && (
            <div className="bg-[var(--paper)] border border-[var(--border)] p-12 text-center">
              <p className="text-[var(--ink-light)] text-lg mb-4">
                {selectedCategory ? 'No topics found in this category' : 'No topics found'}
              </p>
              <Link
                href="/admin/topics/new"
                className="inline-block px-6 py-3 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                Create Your First Topic
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
