import Link from 'next/link';
import { Topic } from '@/types';
import Card from './Card';
import FavoriteButton from './FavoriteButton';
import Markdown from './Markdown';

interface TopicCardProps {
  topic: Topic;
}

const confidenceLabels = {
  beginner: '○○○',
  intermediate: '●○○',
  advanced: '●●○',
  expert: '●●●',
};

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <Card as={Link} href={`/topics/${topic.id}`} className="group p-5 h-full flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-serif font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
          {topic.title}
        </h3>
        <div className="flex items-center space-x-1">
          <FavoriteButton topicId={topic.id} className="p-1" />
          <span className="text-xs text-[var(--ink-light)] font-mono tracking-wider" title={topic.confidence}>
            {confidenceLabels[topic.confidence]}
          </span>
        </div>
      </div>

      <div className="text-[var(--ink-light)] text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
        <Markdown>{topic.description}</Markdown>
      </div>

      <div className="flex flex-wrap gap-2">
        {topic.keyPoints.slice(0, 3).map((kp, idx) => (
          <span
            key={idx}
            className="text-xs bg-[var(--code-bg)] text-[var(--ink-light)] px-2 py-1 border border-[var(--border)]"
          >
            {kp.title}
          </span>
        ))}
        {topic.keyPoints.length > 3 && (
          <span className="text-xs text-[var(--ink-light)]">+{topic.keyPoints.length - 3}</span>
        )}
      </div>
    </Card>
  );
}
