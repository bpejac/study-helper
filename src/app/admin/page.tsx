'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ categories: 0, topics: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, topicsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/topics'),
        ]);

        const categories = await categoriesRes.json();
        const topics = await topicsRes.json();

        setStats({
          categories: Array.isArray(categories) ? categories.length : 0,
          topics: Array.isArray(topics) ? topics.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink)] text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[var(--ink)]">
                Admin Dashboard
              </h1>
              <p className="text-[var(--ink-light)] mt-1">
                Welcome back, {session.user?.name || 'Admin'}!
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--code-bg)] transition cursor-pointer"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-[var(--border)] p-6">
            <p className="text-[var(--ink-light)] text-sm">Total Categories</p>
            <p className="text-3xl font-serif font-bold text-[var(--ink)] mt-2">
              {stats.categories}
            </p>
          </div>

          <div className="border border-[var(--border)] p-6">
            <p className="text-[var(--ink-light)] text-sm">Total Topics</p>
            <p className="text-3xl font-serif font-bold text-[var(--ink)] mt-2">
              {stats.topics}
            </p>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/categories"
            className="border border-[var(--border)] p-6 hover:bg-[var(--paper)] transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">
                Manage Categories
              </h2>
              <span className="text-[var(--ink-light)] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
            <p className="text-[var(--ink-light)] text-sm">
              Create, edit, and delete study categories. Organize your knowledge
              base structure.
            </p>
          </Link>

          <Link
            href="/admin/topics"
            className="border border-[var(--border)] p-6 hover:bg-[var(--paper)] transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">
                Manage Topics
              </h2>
              <span className="text-[var(--ink-light)] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
            <p className="text-[var(--ink-light)] text-sm">
              Add new topics, update existing ones, and manage your study
              materials and code examples.
            </p>
          </Link>

          <Link
            href="/admin/change-password"
            className="border border-[var(--border)] p-6 hover:bg-[var(--paper)] transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">
                Change Password
              </h2>
              <span className="text-[var(--ink-light)] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
            <p className="text-[var(--ink-light)] text-sm">
              Update your admin password.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
