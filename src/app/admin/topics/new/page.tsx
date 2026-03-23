'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

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

export default function NewTopic() {
  const { status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    icon: '',
    categoryId: '',
    confidence: 'beginner',
    keyPoints: [] as KeyPoint[],
    codeExamples: [] as CodeExample[],
    quizQuestions: [] as QuizQuestion[],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCategories();
    }
  }, [status]);

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

      router.push('/admin/topics');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create topic');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addKeyPoint = () => {
    setFormData({
      ...formData,
      keyPoints: [...formData.keyPoints, { title: '', description: '' }],
    });
  };

  const removeKeyPoint = (index: number) => {
    setFormData({
      ...formData,
      keyPoints: formData.keyPoints.filter((_, i) => i !== index),
    });
  };

  const updateKeyPoint = (index: number, field: keyof KeyPoint, value: string) => {
    const updated = [...formData.keyPoints];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, keyPoints: updated });
  };

  const addCodeExample = () => {
    setFormData({
      ...formData,
      codeExamples: [
        ...formData.codeExamples,
        { title: '', language: 'typescript', code: '', explanation: '' },
      ],
    });
  };

  const removeCodeExample = (index: number) => {
    setFormData({
      ...formData,
      codeExamples: formData.codeExamples.filter((_, i) => i !== index),
    });
  };

  const updateCodeExample = (index: number, field: keyof CodeExample, value: string) => {
    const updated = [...formData.codeExamples];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, codeExamples: updated });
  };

  const addQuizQuestion = () => {
    setFormData({
      ...formData,
      quizQuestions: [...formData.quizQuestions, { question: '', answer: '' }],
    });
  };

  const removeQuizQuestion = (index: number) => {
    setFormData({
      ...formData,
      quizQuestions: formData.quizQuestions.filter((_, i) => i !== index),
    });
  };

  const updateQuizQuestion = (index: number, field: keyof QuizQuestion, value: string) => {
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
            <h1 className="text-3xl font-bold text-[var(--ink)]">
              Create New Topic
            </h1>
            <Link
              href="/admin/topics"
              className="px-4 py-2 border border-[var(--border)] text-[var(--ink)] hover:opacity-80 transition cursor-pointer"
            >
              ← Back
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[var(--border)] bg-[var(--paper)]">
            <p className="text-[var(--ink)]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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

            <div>
              <MarkdownEditor
                id="description"
                name="description"
                label="Description *"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                required
                rows={3}
              />
            </div>

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
                <option value="">Select a category</option>
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

          {/* Key Points */}
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[var(--ink)]">Key Points</h2>
              <button
                type="button"
                onClick={addKeyPoint}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                + Add Key Point
              </button>
            </div>
            <div className="space-y-4">
              {formData.keyPoints.map((kp, index) => (
                <div key={index} className="border border-[var(--border)] p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-[var(--ink)]">
                      Key Point #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeKeyPoint(index)}
                      className="text-[var(--ink)] hover:opacity-80 cursor-pointer"
                    >
                      Remove
                    </button>
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

          {/* Code Examples */}
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[var(--ink)]">Code Examples</h2>
              <button
                type="button"
                onClick={addCodeExample}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                + Add Code Example
              </button>
            </div>
            <div className="space-y-4">
              {formData.codeExamples.map((ce, index) => (
                <div key={index} className="border border-[var(--border)] p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-[var(--ink)]">
                      Code Example #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCodeExample(index)}
                      className="text-[var(--ink)] hover:opacity-80 cursor-pointer"
                    >
                      Remove
                    </button>
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
                    placeholder="Language (e.g., typescript, javascript)"
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
                    placeholder="Explanation (optional)"
                    value={ce.explanation}
                    onChange={(e) => updateCodeExample(index, 'explanation', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Questions */}
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[var(--ink)]">Quiz Questions</h2>
              <button
                type="button"
                onClick={addQuizQuestion}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                + Add Question
              </button>
            </div>
            <div className="space-y-4">
              {formData.quizQuestions.map((qq, index) => (
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
          </div>

          {/* Submit */}
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[var(--ink)] text-[var(--background)] py-3 px-4 font-semibold hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Creating...' : 'Create Topic'}
              </button>
              <Link
                href="/admin/topics"
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
