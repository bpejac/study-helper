'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CodeBlock, Markdown } from '@/components';
import Button from '@/components/Button';
import type { Topic, KeyPoint, CodeExample, QuizQuestion } from '@/types';
import Modal from './Modal';
import MarkdownEditor from './MarkdownEditor';

type EditKind =
  | { type: 'keyPoint'; mode: 'add' | 'edit'; index?: number }
  | { type: 'codeExample'; mode: 'add' | 'edit'; index?: number }
  | { type: 'quizQuestion'; mode: 'add' | 'edit'; index?: number }
  | null;

interface TopicInlineSectionsProps {
  topic: Topic;
}

export default function TopicInlineSections({ topic }: TopicInlineSectionsProps) {
  const { status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editKind, setEditKind] = useState<EditKind>(null);
  const [keyPointForm, setKeyPointForm] = useState<KeyPoint>({ title: '', description: '' });
  const [codeExampleForm, setCodeExampleForm] = useState<CodeExample>({
    title: '',
    language: 'typescript',
    code: '',
    explanation: '',
  });
  const [quizQuestionForm, setQuizQuestionForm] = useState<QuizQuestion>({ question: '', answer: '' });

  const isAuthenticated = status === 'authenticated';
  const shouldShowCodeExamples = topic.codeExamples.length > 0 || isAuthenticated;
  const shouldShowQuestions = (topic.quizQuestions?.length || 0) > 0 || isAuthenticated;

  const closeModal = () => {
    setEditKind(null);
    setError('');
  };

  const handleSectionAction = (event: React.MouseEvent, action: () => void) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  const replaceKeyPoints = async (keyPoints: KeyPoint[]) => {
    const response = await fetch(`/api/topics/${topic.id}/key-points`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyPoints }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update key points');
    }
  };

  const replaceCodeExamples = async (codeExamples: CodeExample[]) => {
    const response = await fetch(`/api/topics/${topic.id}/code-examples`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeExamples }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update code examples');
    }
  };

  const replaceQuizQuestions = async (quizQuestions: QuizQuestion[]) => {
    const response = await fetch(`/api/topics/${topic.id}/quiz-questions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizQuestions }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update quiz questions');
    }
  };

  const openEditKeyPoint = (index: number) => {
    setKeyPointForm(topic.keyPoints[index]);
    setEditKind({ type: 'keyPoint', mode: 'edit', index });
  };

  const openAddKeyPoint = () => {
    setKeyPointForm({ title: '', description: '' });
    setEditKind({ type: 'keyPoint', mode: 'add' });
  };

  const openEditCodeExample = (index: number) => {
    const selected = topic.codeExamples[index];
    setCodeExampleForm({
      title: selected.title,
      language: selected.language,
      code: selected.code,
      explanation: selected.explanation || '',
    });
    setEditKind({ type: 'codeExample', mode: 'edit', index });
  };

  const openAddCodeExample = () => {
    setCodeExampleForm({
      title: '',
      language: 'typescript',
      code: '',
      explanation: '',
    });
    setEditKind({ type: 'codeExample', mode: 'add' });
  };

  const openEditQuizQuestion = (index: number) => {
    setQuizQuestionForm(topic.quizQuestions?.[index] || { question: '', answer: '' });
    setEditKind({ type: 'quizQuestion', mode: 'edit', index });
  };

  const openAddQuizQuestion = () => {
    setQuizQuestionForm({ question: '', answer: '' });
    setEditKind({ type: 'quizQuestion', mode: 'add' });
  };

  const handleDeleteKeyPoint = async (index: number) => {
    const confirmed = window.confirm('Delete this key point?');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      const next = topic.keyPoints.filter((_, idx) => idx !== index);
      await replaceKeyPoints(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete key point');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveKeyPoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editKind || editKind.type !== 'keyPoint') return;

    setSaving(true);
    setError('');
    try {
      const next = [...topic.keyPoints];
      if (editKind.mode === 'edit' && editKind.index !== undefined) {
        next[editKind.index] = keyPointForm;
      } else {
        next.push(keyPointForm);
      }
      await replaceKeyPoints(next);
      closeModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editKind.mode} key point`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCodeExample = async (index: number) => {
    const confirmed = window.confirm('Delete this code example?');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      const next = topic.codeExamples.filter((_, idx) => idx !== index);
      await replaceCodeExamples(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete code example');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCodeExample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editKind || editKind.type !== 'codeExample') return;

    setSaving(true);
    setError('');
    try {
      const next = [...topic.codeExamples];
      if (editKind.mode === 'edit' && editKind.index !== undefined) {
        next[editKind.index] = codeExampleForm;
      } else {
        next.push(codeExampleForm);
      }
      await replaceCodeExamples(next);
      closeModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editKind.mode} code example`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuizQuestion = async (index: number) => {
    const confirmed = window.confirm('Delete this question?');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      const next = (topic.quizQuestions || []).filter((_, idx) => idx !== index);
      await replaceQuizQuestions(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveQuizQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editKind || editKind.type !== 'quizQuestion') return;

    setSaving(true);
    setError('');
    try {
      const current = topic.quizQuestions || [];
      const next = [...current];
      if (editKind.mode === 'edit' && editKind.index !== undefined) {
        next[editKind.index] = quizQuestionForm;
      } else {
        next.push(quizQuestionForm);
      }
      await replaceQuizQuestions(next);
      closeModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editKind.mode} question`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {error && <p className="text-sm text-[var(--accent)] mb-5">{error}</p>}

      <details open className="group mb-10">
        <summary className="flex items-center justify-between cursor-pointer list-none mb-5 pb-2 border-b border-[var(--border)]">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">Key Points</h2>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                onClick={(event) => handleSectionAction(event, openAddKeyPoint)}
                disabled={saving}
              >
                Add
              </Button>
            )}
            <svg
              className="w-5 h-5 text-[var(--ink-light)] transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </summary>
        <div className="space-y-4">
          {topic.keyPoints.map((point, index) => (
            <div key={index} className="bg-[var(--paper)] border border-[var(--border)] p-4 paper-shadow">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-serif font-semibold text-[var(--ink)]">{point.title}</h3>
                {isAuthenticated && (
                  <div className="flex items-center gap-2 text-xs shrink-0">
                    <Button onClick={() => openEditKeyPoint(index)}>Edit</Button>
                    <Button tone="danger" onClick={() => handleDeleteKeyPoint(index)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              <div className="text-[var(--ink-light)] text-sm leading-relaxed">
                <Markdown>{point.description}</Markdown>
              </div>
            </div>
          ))}
          {topic.keyPoints.length === 0 && (
            <div className="text-sm text-[var(--ink-light)]">No key points yet.</div>
          )}
        </div>
      </details>

      {shouldShowCodeExamples && (
        <details className="group mb-10">
          <summary className="flex items-center justify-between cursor-pointer list-none mb-5 pb-2 border-b border-[var(--border)]">
            <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">Code Examples</h2>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  onClick={(event) => handleSectionAction(event, openAddCodeExample)}
                  disabled={saving}
                >
                  Add
                </Button>
              )}
              <svg
                className="w-5 h-5 text-[var(--ink-light)] transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          <div className="space-y-6">
            {topic.codeExamples.map((example, index) => (
              <div key={index} className="space-y-2">
                {isAuthenticated && (
                  <div className="flex justify-end gap-2 text-xs">
                    <Button onClick={() => openEditCodeExample(index)}>Edit</Button>
                    <Button tone="danger" onClick={() => handleDeleteCodeExample(index)}>
                      Delete
                    </Button>
                  </div>
                )}
                <CodeBlock example={example} />
              </div>
            ))}
            {topic.codeExamples.length === 0 && (
              <div className="text-sm text-[var(--ink-light)]">No code examples yet.</div>
            )}
          </div>
        </details>
      )}

      {shouldShowQuestions && (
        <details className="group mb-10">
          <summary className="flex items-center justify-between cursor-pointer list-none mb-5 pb-2 border-b border-[var(--border)]">
            <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">Questions</h2>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  onClick={(event) => handleSectionAction(event, openAddQuizQuestion)}
                  disabled={saving}
                >
                  Add
                </Button>
              )}
              <svg
                className="w-5 h-5 text-[var(--ink-light)] transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          <div className="space-y-4">
            {(topic.quizQuestions || []).map((item, index) => (
              <div key={index} className="bg-[var(--paper)] border border-[var(--border)] p-4 paper-shadow">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-serif font-semibold text-[var(--ink)]">Question {index + 1}</h3>
                  {isAuthenticated && (
                    <div className="flex items-center gap-2 text-xs shrink-0">
                      <Button onClick={() => openEditQuizQuestion(index)}>Edit</Button>
                      <Button tone="danger" onClick={() => handleDeleteQuizQuestion(index)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <div className="text-[var(--ink)] leading-relaxed mb-4">
                  <Markdown>{item.question}</Markdown>
                </div>
                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--ink-light)] mb-2">
                    Answer
                  </div>
                  <div className="text-[var(--ink-light)] text-sm leading-relaxed">
                    <Markdown>{item.answer}</Markdown>
                  </div>
                </div>
              </div>
            ))}
            {(topic.quizQuestions || []).length === 0 && (
              <div className="text-sm text-[var(--ink-light)]">No questions yet.</div>
            )}
          </div>
        </details>
      )}

      <Modal
        title={
          editKind?.type === 'keyPoint'
            ? editKind.mode === 'add'
              ? 'Add Key Point'
              : 'Edit Key Point'
            : editKind?.type === 'codeExample'
              ? editKind.mode === 'add'
                ? 'Add Code Example'
                : 'Edit Code Example'
              : editKind?.mode === 'add'
                ? 'Add Question'
                : 'Edit Question'
        }
        isOpen={!!editKind}
        onClose={closeModal}
      >
        {editKind?.type === 'keyPoint' && (
          <form onSubmit={handleSaveKeyPoint} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--ink)] mb-1">Title</label>
              <input
                type="text"
                value={keyPointForm.title}
                onChange={(e) => setKeyPointForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)]"
                required
              />
            </div>
            <MarkdownEditor
              id="edit-key-point-description"
              label="Description"
              value={keyPointForm.description}
              onChange={(value) => setKeyPointForm((prev) => ({ ...prev, description: value }))}
              rows={4}
              required
            />
            <Button type="submit" tone="primary" size="md" disabled={saving} className="w-full">
              {saving ? 'Saving...' : editKind.mode === 'add' ? 'Add Key Point' : 'Save Key Point'}
            </Button>
          </form>
        )}

        {editKind?.type === 'codeExample' && (
          <form onSubmit={handleSaveCodeExample} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--ink)] mb-1">Title</label>
              <input
                type="text"
                value={codeExampleForm.title}
                onChange={(e) => setCodeExampleForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--ink)] mb-1">Language</label>
              <input
                type="text"
                value={codeExampleForm.language}
                onChange={(e) => setCodeExampleForm((prev) => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--ink)] mb-1">Code</label>
              <textarea
                value={codeExampleForm.code}
                onChange={(e) => setCodeExampleForm((prev) => ({ ...prev, code: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--background)] font-mono text-sm"
                required
              />
            </div>
            <MarkdownEditor
              id="edit-code-example-explanation"
              label="Explanation"
              value={codeExampleForm.explanation || ''}
              onChange={(value) => setCodeExampleForm((prev) => ({ ...prev, explanation: value }))}
              rows={3}
            />
            <Button type="submit" tone="primary" size="md" disabled={saving} className="w-full">
              {saving ? 'Saving...' : editKind.mode === 'add' ? 'Add Code Example' : 'Save Code Example'}
            </Button>
          </form>
        )}

        {editKind?.type === 'quizQuestion' && (
          <form onSubmit={handleSaveQuizQuestion} className="space-y-4">
            <MarkdownEditor
              id="edit-quiz-question"
              label="Question"
              value={quizQuestionForm.question}
              onChange={(value) => setQuizQuestionForm((prev) => ({ ...prev, question: value }))}
              rows={3}
              required
            />
            <MarkdownEditor
              id="edit-quiz-answer"
              label="Answer"
              value={quizQuestionForm.answer}
              onChange={(value) => setQuizQuestionForm((prev) => ({ ...prev, answer: value }))}
              rows={4}
              required
            />
            <Button type="submit" tone="primary" size="md" disabled={saving} className="w-full">
              {saving ? 'Saving...' : editKind.mode === 'add' ? 'Add Question' : 'Save Question'}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
