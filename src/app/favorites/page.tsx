'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserData, TopicCard } from '@/components';
import type { Topic } from '@/types';

export default function FavoritesPage() {
  const { favorites, getMissedQuestions, clearQuizHistory } = useUserData();
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => {
        setAllTopics(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading topics:', err);
        setIsLoading(false);
      });
  }, []);

  const favoriteTopics = favorites
    .map(id => allTopics.find(t => t.id === id))
    .filter((topic): topic is Topic => topic !== undefined);
  
  const missedQuestions = getMissedQuestions();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-2xl font-serif font-bold text-[var(--ink)] mb-3">My Study List</h1>
          <p className="text-[var(--ink-light)] leading-relaxed">
            Your favorited topics and questions to review.
          </p>
        </div>

        {/* Favorite Topics */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] mb-5 pb-2 border-b border-[var(--border)]">
            Favorite Topics ({favoriteTopics.length})
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-[var(--ink-light)]">Loading...</p>
            </div>
          ) : favoriteTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteTopics.map(topic => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--paper)] border border-[var(--border)]">
              <p className="text-[var(--ink-light)] mb-2">No favorites yet</p>
              <p className="text-sm text-[var(--ink-light)]">
                Click the heart icon on any topic to save it here.
              </p>
            </div>
          )}
        </section>

        {/* Missed Questions */}
        <section>
          <div className="flex items-center justify-between mb-5 pb-2 border-b border-[var(--border)]">
            <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">
              Questions to Review ({missedQuestions.length})
            </h2>
            {missedQuestions.length > 0 && (
              <button
                onClick={clearQuizHistory}
                className="text-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
              >
                Clear history
              </button>
            )}
          </div>
          
          {missedQuestions.length > 0 ? (
            <div className="space-y-4">
              {missedQuestions.map((item, idx) => {
                const topic = allTopics.find(t => t.id === item.topicId);
                return (
                  <div
                    key={idx}
                    className="bg-[var(--paper)] border border-[var(--border)] p-5 paper-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-[var(--ink-light)] font-mono">
                        {topic?.title || item.topicId}
                      </span>
                      <Link
                        href={`/topics/${item.topicId}`}
                        className="text-xs text-[var(--accent)] hover:underline"
                      >
                        View topic →
                      </Link>
                    </div>
                    <p className="font-serif font-medium text-[var(--ink)] mb-3">
                      {item.question}
                    </p>
                    <details className="group">
                      <summary className="text-sm text-[var(--accent)] cursor-pointer hover:underline">
                        Show answer
                      </summary>
                      <p className="mt-2 text-sm text-[var(--ink-light)] pl-4 border-l-2 border-[var(--border)]">
                        {/* We need to look up the answer */}
                        {topic?.keyPoints.find(kp => 
                          item.question.includes(kp.title)
                        )?.description || topic?.description || 'Review this topic for the answer.'}
                      </p>
                    </details>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--paper)] border border-[var(--border)]">
              <p className="text-[var(--ink-light)] mb-2">No missed questions</p>
              <p className="text-sm text-[var(--ink-light)]">
                Questions you miss in the quiz will appear here for review.
              </p>
              <Link
                href="/quiz"
                className="inline-block mt-4 px-4 py-2 bg-[var(--ink)] text-[var(--background)] text-sm transition-colors hover:opacity-80"
              >
                Start Quiz
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
