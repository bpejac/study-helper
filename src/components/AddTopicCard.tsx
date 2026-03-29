'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Card from './Card';

interface AddTopicCardProps {
  categoryId: string;
}

export default function AddTopicCard({ categoryId }: AddTopicCardProps) {
  const { status } = useSession();

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <Card as={Link} href={`/topics/new?categoryId=${categoryId}`} className="group p-6 h-full flex items-center justify-center !bg-transparent border-2 border-dashed hover:!bg-[var(--paper)]">
      <div className="text-center">
        <div className="text-4xl text-[var(--ink-light)] group-hover:text-[var(--accent)] transition-colors">
          +
        </div>
        <p className="text-sm text-[var(--ink-light)] group-hover:text-[var(--accent)] transition-colors mt-2">
          Add Topic
        </p>
      </div>
    </Card>
  );
}
