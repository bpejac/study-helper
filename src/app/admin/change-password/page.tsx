'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const { status } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to change password');
      } else {
        setSuccess('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink)] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto px-6">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="border border-[var(--border)] p-8">
          <h1 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">
            Change Password
          </h1>

          {error && (
            <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 border border-green-300 bg-green-50 text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm text-[var(--ink-light)] mb-1"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm text-[var(--ink-light)] mb-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-[var(--ink-light)] mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
