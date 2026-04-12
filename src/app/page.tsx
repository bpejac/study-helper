import Link from 'next/link';
import { CategoryCard, TopicCard } from '@/components';
import { getAllCategories, getAllTopics } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categories = await getAllCategories();
  const topics = await getAllTopics();
  
  // Get topic counts by category
  const topicCountsByCategory = topics.reduce((acc, topic) => {
    acc[topic.categoryId] = (acc[topic.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get a few recent/featured topics
  const featuredTopics = topics.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-rainbow-section py-16 sm:py-24 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--ink)] mb-6 leading-tight">
              Study Helper
            </h1>
            <p className="text-lg text-[var(--ink-light)] max-w-xl mx-auto mb-8 leading-relaxed">
              A personal collection of notes and concepts from my computer science studies. 
              For review, recollection, and reference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/categories"
                className="px-5 py-2.5 bg-[var(--ink)] hover:opacity-80 text-[var(--background)] text-sm tracking-wide transition-colors"
              >
                Browse Subjects
              </Link>
              <Link
                href="/quiz"
                className="px-5 py-2.5 bg-[var(--paper)] hover:bg-[var(--code-bg)] border border-[var(--border)] text-[var(--ink)] text-sm tracking-wide transition-colors"
              >
                Test Knowledge
              </Link>
              <Link
                href="/quiz-questions"
                className="px-5 py-2.5 bg-[var(--paper)] hover:bg-[var(--code-bg)] border border-[var(--border)] text-[var(--ink)] text-sm tracking-wide transition-colors"
              >
                View Questions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-b border-[var(--border)] bg-[var(--paper)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-[var(--ink)]">{categories.length}</div>
              <div className="text-[var(--ink-light)] text-sm mt-1">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-[var(--ink)]">{topics.length}</div>
              <div className="text-[var(--ink-light)] text-sm mt-1">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-[var(--ink)]">
                {topics.reduce((acc, t) => acc + t.codeExamples.length, 0)}
              </div>
              <div className="text-[var(--ink-light)] text-sm mt-1">Examples</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-[var(--ink)]">
                {topics.reduce((acc, t) => acc + t.keyPoints.length, 0)}
              </div>
              <div className="text-[var(--ink-light)] text-sm mt-1">Key Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">Subjects</h2>
            <Link href="/categories" className="text-sm text-[var(--accent)] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                topicCount={topicCountsByCategory[category.id] || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-12 bg-[var(--paper)] border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">Recent Notes</h2>
            <Link href="/categories" className="text-sm text-[var(--accent)] hover:underline">
              Browse all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-serif text-[var(--ink)]">Study Helper</span>
            <p className="text-[var(--ink-light)] text-sm">
              Vibe coded with Next.js &amp; TypeScript
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
