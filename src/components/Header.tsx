'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isAdminRoute = pathname.startsWith('/admin');

  const navLinks = isAdminRoute
    ? [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/categories', label: 'Categories' },
        { href: '/admin/topics', label: 'Topics' },
        { href: '/admin/change-password', label: 'Password' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/categories', label: 'Subjects' },
        { href: '/quiz', label: 'Quiz' },
        { href: '/quiz-questions', label: 'Questions' },
        { href: '/favorites', label: 'My List' },
      ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href={isAdminRoute ? '/admin' : '/'} className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold text-[var(--ink)] tracking-tight">
              Study Helper
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors text-sm tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            {isAdminRoute && (
              <Link href="/" className="text-[var(--accent)] hover:text-[var(--ink)] transition-colors text-sm tracking-wide">
                View Site
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {!isAdminRoute && (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 sm:w-48 px-4 py-2 pl-9 bg-[var(--paper)] border border-[var(--border)] rounded text-[var(--ink)] placeholder-[var(--ink-light)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-light)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </form>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
