'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

interface QuizQuestion {
  question: string;
  answer: string;
}

interface Topic {
  id: string;
  title: string;
  quizQuestions: QuizQuestion[];
}

export default function EditQuizQuestions() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [initialQuizQuestions, setInitialQuizQuestions] = useState<QuizQuestion[]>([]);

  const hasUnsavedChanges = JSON.stringify(quizQuestions) !== JSON.stringify(initialQuizQuestions);

  const handleNavigation = (href: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (confirmed) {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, id]);

  const fetchData = async () => {
    try {
      const topicRes = await fetch(`/api/topics/${id}`);
      if (!topicRes.ok) {
        throw new Error('Failed to fetch topic');
      }
      const topicData = await topicRes.json();
      setTopic(topicData);
      setQuizQuestions(topicData.quizQuestions || []);
      setInitialQuizQuestions(topicData.quizQuestions || []);
    } catch (err) {
      setError('Failed to load topic');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/topics/${id}/quiz-questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizQuestions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update quiz questions');
      }

      router.push("/admin/topics");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quiz questions');
    } finally {
      setSaving(false);
    }
  };

  const addQuizQuestion = () => {
    setQuizQuestions([{ question: '', answer: '' }, ...quizQuestions]);
  };

  const removeQuizQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const updateQuizQuestion = (index: number, field: keyof QuizQuestion, value: string) => {
    const updated = [...quizQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setQuizQuestions(updated);
  };

  // Warn user when leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink)] text-lg">Loading...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink)] text-lg">Topic not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--paper)] border border-[var(--border)] p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[var(--ink)]">Edit Quiz Questions</h1>
              <p className="text-[var(--ink-light)] mt-2">{topic.title}</p>
            </div>
            <div className="flex gap-3">
              {hasUnsavedChanges && (
                <span className="text-[var(--accent)] text-sm font-medium">Unsaved changes</span>
              )}
              <button
                form="quiz-questions-form"
                type="submit"
                disabled={saving || !hasUnsavedChanges}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => handleNavigation("/admin/topics")}
                className="px-4 py-2 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition cursor-pointer"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[var(--border)] bg-[var(--paper)]">
            <p className="text-[var(--ink)]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" id="quiz-questions-form">
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--ink)]">Quiz Questions</h2>
              <button
                type="button"
                onClick={addQuizQuestion}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                + Add Question
              </button>
            </div>

            {quizQuestions.length === 0 ? (
              <div className="text-center py-8 text-[var(--ink-light)]">
                No quiz questions yet. Click &quot;Add Question&quot; to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {quizQuestions.map((qq, index) => (
                  <div key={index} className="border border-[var(--border)] p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-[var(--ink)]">
                        Question #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuizQuestion(index)}
                        className="text-[var(--ink)] hover:opacity-80 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mb-2">
                      <MarkdownEditor
                        id={`quiz-question-${index}`}
                        label="Question"
                        value={qq.question}
                        onChange={(value) => updateQuizQuestion(index, 'question', value)}
                        rows={2}
                        placeholder="Question"
                      />
                    </div>
                    <MarkdownEditor
                      id={`quiz-answer-${index}`}
                      label="Answer"
                      value={qq.answer}
                      onChange={(value) => updateQuizQuestion(index, 'answer', value)}
                      rows={3}
                      placeholder="Answer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[var(--ink)] text-[var(--background)] py-3 px-4 font-semibold hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => handleNavigation("/admin/topics")}
                className="px-6 py-3 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
