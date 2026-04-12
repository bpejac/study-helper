'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { status } = useSession();
  const isAdmin = status === 'authenticated';
  const showSearch = pathname !== '/login';

  const navLinks = [
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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)] pt-3 relative">
      <div className="flex items-center justify-between gap-3 px-3 pb-3 md:pb-0">
        <Link href="/" className="flex items-center shrink-0">
          <span className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] tracking-tight whitespace-nowrap">
            Study Helper
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {isAdmin && (
            <span className="hidden h-8 lg:inline-flex items-center text-xs border border-[var(--accent)] text-[var(--accent)] px-2 whitespace-nowrap">
              Editing enabled
            </span>
          )}

          {showSearch && (
            <form onSubmit={handleSearch} className="hidden md:flex items-center min-w-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-36 lg:w-48 xl:w-56 px-4 pl-9 bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] placeholder-[var(--ink-light)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
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

          {!isAdmin && pathname !== '/login' && (
            <Link
              href="/login"
              className="h-8 inline-flex items-center text-xs text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors border border-[var(--border)] px-2 whitespace-nowrap"
            >
              Login
            </Link>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="h-8 inline-flex items-center text-xs text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors border border-[var(--border)] px-2 cursor-pointer whitespace-nowrap"
            >
              Logout
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
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

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden h-8 w-8 inline-flex items-center justify-center text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors border border-[var(--border)]"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 mt-3 p-3 border-t border-[var(--border)] bg-[var(--paper)]">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors text-sm tracking-wide whitespace-nowrap"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 md:hidden pt-3 px-3 border-b border-t border-[var(--border)] space-y-3 bg-[var(--paper)] shadow-lg">
          {showSearch && (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-9 bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] placeholder-[var(--ink-light)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
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

          <nav className="flex flex-col gap-2 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors text-sm tracking-wide py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
