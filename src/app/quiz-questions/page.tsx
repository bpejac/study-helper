'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Markdown from '@/components/Markdown';

interface Category {
  id: string;
  name: string;
}

interface QuizQuestionData {
  question: string;
  answer: string;
}

interface Topic {
  id: string;
  title: string;
  categoryId: string;
  category: Category;
  quizQuestions: QuizQuestionData[];
}

export default function QuizQuestionsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics');
        const data = await response.json();
        // Filter to only topics that have quiz questions
        const topicsWithQuestions = data.filter(
          (topic: Topic) => topic.quizQuestions && topic.quizQuestions.length > 0
        );
        setTopics(topicsWithQuestions);
        // Expand first topic by default
        if (topicsWithQuestions.length > 0) {
          setExpandedTopics(new Set([topicsWithQuestions[0].id]));
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const filteredTopics = selectedTopic
    ? topics.filter((t) => t.id === selectedTopic)
    : topics;

  const totalQuestions = topics.reduce(
    (sum, topic) => sum + (topic.quizQuestions?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink)] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-[var(--paper)] border border-[var(--border)] p-6 mb-8">
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">
            Quiz Questions
          </h1>
          <p className="text-[var(--ink-light)]">
            {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} across{' '}
            {topics.length} topic{topics.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter */}
        <div className="bg-[var(--paper)] border border-[var(--border)] p-6 mb-8">
          <label htmlFor="topic-filter" className="block text-sm font-medium text-[var(--ink)] mb-3">
            Filter by topic:
          </label>
          <select
            id="topic-filter"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] cursor-pointer"
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title} ({topic.quizQuestions?.length || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Questions by Topic */}
        <div className="space-y-4">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-8 text-[var(--ink-light)]">
              No topics with quiz questions found.
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-[var(--paper)] border border-[var(--border)]"
              >
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full px-6 py-4 hover:bg-[var(--code-bg)] transition text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--ink)]">
                      {topic.title}
                    </h2>
                    <p className="text-sm text-[var(--ink-light)]">
                      {topic.category.name} •{' '}
                      {topic.quizQuestions?.length || 0} question
                      {topic.quizQuestions?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span
                    className={`text-[var(--ink)] transition-transform ${
                      expandedTopics.has(topic.id) ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* Questions */}
                {expandedTopics.has(topic.id) && (
                  <div className="border-t border-[var(--border)] px-6 py-4 space-y-4">
                    {topic.quizQuestions?.map((question, idx) => (
                      <div
                        key={`${topic.id}-q-${idx}`}
                        className="pb-4 last:pb-0 border-b last:border-b-0 border-[var(--border)]"
                      >
                        <div className="flex gap-3">
                          <span className="font-medium text-[var(--ink-light)] min-w-8">
                            {idx + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[var(--ink)] font-medium mb-2 prose prose-invert max-w-none overflow-hidden">
                              <Markdown>{question.question}</Markdown>
                            </div>
                            <details className="cursor-pointer">
                              <summary className="text-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition">
                                Show answer
                              </summary>
                              <div className="mt-2 p-3 bg-[var(--code-bg)] text-[var(--ink)] rounded border border-[var(--border)] prose prose-invert max-w-none overflow-hidden">
                                <Markdown>{question.answer}</Markdown>
                              </div>
                            </details>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
          <Link
            href="/quiz"
            className="inline-block px-6 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition"
          >
            Back to Quiz Mode
          </Link>
        </div>
      </div>
    </div>
  );
}
