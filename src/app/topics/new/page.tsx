'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import MarkdownEditor from '@/components/editor/MarkdownEditor';

interface Category {
  id: string;
  name: string;
}

interface KeyPoint {
  title: string;
  description: string;
}

interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

interface QuizQuestion {
  question: string;
  answer: string;
}

export default function NewTopicPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoryId = useMemo(() => searchParams.get('categoryId') || '', [searchParams]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    icon: '',
    categoryId: initialCategoryId,
    confidence: 'beginner',
    keyPoints: [] as KeyPoint[],
    codeExamples: [] as CodeExample[],
    quizQuestions: [] as QuizQuestion[],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      const callbackUrl = initialCategoryId ? `/topics/new?categoryId=${initialCategoryId}` : '/topics/new';
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [status, router, initialCategoryId]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCategories();
    }
  }, [status]);

  useEffect(() => {
    if (initialCategoryId) {
      setFormData((prev) => ({ ...prev, categoryId: initialCategoryId }));
    }
  }, [initialCategoryId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create topic');
      }

      setIsDirty(false);
      router.push(`/categories/${formData.categoryId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create topic');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setIsDirty(true);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    router.push(formData.categoryId ? `/categories/${formData.categoryId}` : '/categories');
  };

  const addKeyPoint = () => {
    setIsDirty(true);
    setFormData({
      ...formData,
      keyPoints: [...formData.keyPoints, { title: '', description: '' }],
    });
  };

  const removeKeyPoint = (index: number) => {
    setIsDirty(true);
    setFormData({
      ...formData,
      keyPoints: formData.keyPoints.filter((_, i) => i !== index),
    });
  };

  const updateKeyPoint = (index: number, field: keyof KeyPoint, value: string) => {
    setIsDirty(true);
    const updated = [...formData.keyPoints];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, keyPoints: updated });
  };

  const addCodeExample = () => {
    setIsDirty(true);
    setFormData({
      ...formData,
      codeExamples: [
        ...formData.codeExamples,
        { title: '', language: 'typescript', code: '', explanation: '' },
      ],
    });
  };

  const removeCodeExample = (index: number) => {
    setIsDirty(true);
    setFormData({
      ...formData,
      codeExamples: formData.codeExamples.filter((_, i) => i !== index),
    });
  };

  const updateCodeExample = (index: number, field: keyof CodeExample, value: string) => {
    setIsDirty(true);
    const updated = [...formData.codeExamples];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, codeExamples: updated });
  };

  const addQuizQuestion = () => {
    setIsDirty(true);
    setFormData({
      ...formData,
      quizQuestions: [...formData.quizQuestions, { question: '', answer: '' }],
    });
  };

  const removeQuizQuestion = (index: number) => {
    setIsDirty(true);
    setFormData({
      ...formData,
      quizQuestions: formData.quizQuestions.filter((_, i) => i !== index),
    });
  };

  const updateQuizQuestion = (index: number, field: keyof QuizQuestion, value: string) => {
    setIsDirty(true);
    const updated = [...formData.quizQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, quizQuestions: updated });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink)] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--paper)] border border-[var(--border)] p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[var(--ink)]">Create New Topic</h1>
            <Button type="button" size="md" onClick={handleBack}>
              Back
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[var(--border)] bg-[var(--paper)]">
            <p className="text-[var(--ink)]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6">
            <h2 className="text-xl font-bold text-[var(--ink)]">Basic Information</h2>

            <div>
              <label htmlFor="id" className="block text-sm font-medium text-[var(--ink)] mb-2">
                ID (URL-friendly) *
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                placeholder="e.g., react-hooks"
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--ink)] mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., React Hooks"
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
              />
            </div>

            <MarkdownEditor
              id="description"
              name="description"
              label="Description"
              value={formData.description}
              onChange={(value) => { setIsDirty(true); setFormData({ ...formData, description: value }); }}
              required
              rows={3}
            />

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-[var(--ink)] mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g., ⚛️"
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-[var(--ink)] mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] cursor-pointer"
              >
                <option value="">Select a subject</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="confidence" className="block text-sm font-medium text-[var(--ink)] mb-2">
                Confidence Level *
              </label>
              <select
                id="confidence"
                name="confidence"
                value={formData.confidence}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] cursor-pointer"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[var(--ink)]">Key Points</h2>
              <Button type="button" tone="primary" size="md" onClick={addKeyPoint}>
                Add Key Point
              </Button>
            </div>
            <div className="space-y-4">
              {formData.keyPoints.map((kp, index) => (
                <div key={index} className="border border-[var(--border)] p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-[var(--ink)]">Key Point #{index + 1}</span>
                    <Button type="button" onClick={() => removeKeyPoint(index)}>
                      Remove
                    </Button>
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={kp.title}
                    onChange={(e) => updateKeyPoint(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
                  />
                  <MarkdownEditor
                    id={`key-point-description-${index}`}
                    label="Description"
                    value={kp.description}
                    onChange={(value) => updateKeyPoint(index, 'description', value)}
                    rows={2}
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[var(--ink)]">Code Examples</h2>
              <Button type="button" tone="primary" size="md" onClick={addCodeExample}>
                Add Code Example
              </Button>
            </div>
            <div className="space-y-4">
              {formData.codeExamples.map((ce, index) => (
                <div key={index} className="border border-[var(--border)] p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-[var(--ink)]">Code Example #{index + 1}</span>
                    <Button type="button" onClick={() => removeCodeExample(index)}>
                      Remove
                    </Button>
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={ce.title}
                    onChange={(e) => updateCodeExample(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
                  />
                  <input
                    type="text"
                    placeholder="Language"
                    value={ce.language}
                    onChange={(e) => updateCodeExample(index, 'language', e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
                  />
                  <textarea
                    placeholder="Code"
                    value={ce.code}
                    onChange={(e) => updateCodeExample(index, 'code', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 mb-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] font-mono text-sm"
                  />
                  <textarea
                    placeholder="Explanation"
                    value={ce.explanation}
                    onChange={(e) => updateCodeExample(index, 'explanation', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[var(--ink)]">Quiz Questions</h2>
              <Button type="button" tone="primary" size="md" onClick={addQuizQuestion}>
                Add Question
              </Button>
            </div>
            <div className="space-y-4">
              {formData.quizQuestions.map((qq, index) => (
                <div key={index} className="border border-[var(--border)] p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-[var(--ink)]">Question #{index + 1}</span>
                    <Button type="button" onClick={() => removeQuizQuestion(index)}>
                      Remove
                    </Button>
                  </div>
                  <MarkdownEditor
                    id={`quiz-question-${index}`}
                    label="Question"
                    value={qq.question}
                    onChange={(value) => updateQuizQuestion(index, 'question', value)}
                    rows={2}
                    placeholder="Question"
                  />
                  <div className="mt-2">
                    <MarkdownEditor
                      id={`quiz-answer-${index}`}
                      label="Answer"
                      value={qq.answer}
                      onChange={(value) => updateQuizQuestion(index, 'answer', value)}
                      rows={3}
                      placeholder="Answer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex gap-3">
              <Button type="submit" tone="primary" size="lg" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Topic'}
              </Button>
              <Link
                href={formData.categoryId ? `/categories/${formData.categoryId}` : '/categories'}
                className="px-6 py-3 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition text-center cursor-pointer"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
