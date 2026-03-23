import Link from 'next/link';
import { Category } from '@/types';
import Card from './Card';
import Markdown from './Markdown';

interface CategoryCardProps {
  category: Category;
  topicCount: number;
}

export default function CategoryCard({ category, topicCount }: CategoryCardProps) {
  return (
    <Card as={Link} href={`/categories/${category.id}`} className="group p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{category.icon}</span>
        <span className="text-xs text-[var(--ink-light)] font-mono">{topicCount} notes</span>
      </div>

      <h3 className="text-lg font-serif font-semibold text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors">
        {category.name}
      </h3>
      <div className="text-[var(--ink-light)] text-sm leading-relaxed flex-grow">
        <Markdown>{category.description}</Markdown>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <span className="text-xs text-[var(--accent)] group-hover:underline">
          Open notebook →
        </span>
      </div>
    </Card>
  );
}
