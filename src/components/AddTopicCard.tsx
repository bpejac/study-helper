'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface AddTopicCardProps {
  categoryId: string;
}

export default function AddTopicCard({ categoryId }: AddTopicCardProps) {
  const { status } = useSession();

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <Link
      href={`/topics/new?categoryId=${categoryId}`}
      className="group border-2 border-dashed border-[var(--border)] bg-[var(--paper)] p-6 h-full flex items-center justify-center hover:border-[var(--ink)] hover:bg-[var(--background)] transition-colors cursor-pointer"
    >
      <div className="text-center">
        <div className="text-4xl text-[var(--ink-light)] group-hover:text-[var(--ink)] transition-colors">
          +
        </div>
        <p className="text-sm text-[var(--ink-light)] group-hover:text-[var(--ink)] transition-colors mt-2">
          Add Topic
        </p>
      </div>
    </Link>
  );
}
