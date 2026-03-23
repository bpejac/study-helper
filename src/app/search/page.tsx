'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TopicCard } from '@/components';
import type { Topic } from '@/types';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    fetch(`/api/topics?search=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setIsLoading(false);
      });
  }, [query]);

  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-serif font-bold text-[var(--ink)] mb-3">Search Results</h1>
        {isLoading ? (
          <p className="text-[var(--ink-light)]">Searching...</p>
        ) : query ? (
          <p className="text-[var(--ink-light)]">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
        ) : (
          <p className="text-[var(--ink-light)]">Enter a search term to find topics</p>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-[var(--ink-light)]">Loading...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16 bg-[var(--paper)] border border-[var(--border)]">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-lg font-serif font-semibold text-[var(--ink)] mb-2">No results found</h2>
          <p className="text-[var(--ink-light)] mb-6">
            Try different keywords or browse subjects
          </p>
          <Link
            href="/categories"
            className="px-5 py-2.5 bg-[var(--ink)] text-[var(--background)] text-sm transition-colors hover:opacity-80 inline-block"
          >
            Browse Subjects
          </Link>
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--paper)] border border-[var(--border)]">
          <div className="text-4xl mb-4">💡</div>
          <h2 className="text-lg font-serif font-semibold text-[var(--ink)] mb-2">Start Searching</h2>
          <p className="text-[var(--ink-light)]">
            Use the search bar above to find topics and concepts
          </p>
        </div>
      )}
    </>
  );
}

function SearchLoading() {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-serif font-bold text-[var(--ink)] mb-3">Search Results</h1>
      <p className="text-[var(--ink-light)]">Loading...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Suspense fallback={<SearchLoading />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
