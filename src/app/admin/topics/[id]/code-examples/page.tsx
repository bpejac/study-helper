'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

interface Topic {
  id: string;
  title: string;
  codeExamples: CodeExample[];
}

export default function EditCodeExamples() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [codeExamples, setCodeExamples] = useState<CodeExample[]>([]);
  const [initialCodeExamples, setInitialCodeExamples] = useState<CodeExample[]>([]);

  const hasUnsavedChanges = JSON.stringify(codeExamples) !== JSON.stringify(initialCodeExamples);

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
      setCodeExamples(topicData.codeExamples || []);
      setInitialCodeExamples(topicData.codeExamples || []);
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
      const response = await fetch(`/api/topics/${id}/code-examples`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeExamples,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update code examples');
      }

      router.push("/admin/topics");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update code examples');
    } finally {
      setSaving(false);
    }
  };

  const addCodeExample = () => {
    setCodeExamples([
      { title: '', language: 'typescript', code: '', explanation: '' },
      ...codeExamples,
    ]);
  };

  const removeCodeExample = (index: number) => {
    setCodeExamples(codeExamples.filter((_, i) => i !== index));
  };

  const updateCodeExample = (index: number, field: keyof CodeExample, value: string) => {
    const updated = [...codeExamples];
    updated[index] = { ...updated[index], [field]: value };
    setCodeExamples(updated);
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
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--paper)] border border-[var(--border)] p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[var(--ink)]">Edit Code Examples</h1>
              <p className="text-[var(--ink-light)] mt-2">{topic.title}</p>
            </div>
            <div className="flex gap-3">
              {hasUnsavedChanges && (
                <span className="text-[var(--accent)] text-sm font-medium">Unsaved changes</span>
              )}
              <button
                form="code-examples-form"
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

        <form onSubmit={handleSubmit} className="space-y-6" id="code-examples-form">
          <div className="bg-[var(--paper)] border border-[var(--border)] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--ink)]">Code Examples</h2>
              <button
                type="button"
                onClick={addCodeExample}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--background)] hover:opacity-80 transition cursor-pointer"
              >
                + Add Code Example
              </button>
            </div>

            {codeExamples.length === 0 ? (
              <div className="text-center py-8 text-[var(--ink-light)]">
                No code examples yet. Click "Add Code Example" to create one.
              </div>
            ) : (
              <div className="space-y-6">
                {codeExamples.map((ce, index) => (
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
                      className="w-full px-4 py-2 mb-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
                    />
                    <select
                      value={ce.language}
                      onChange={(e) => updateCodeExample(index, 'language', e.target.value)}
                      className="w-full px-4 py-2 mb-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] cursor-pointer"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="csharp">C#</option>
                      <option value="cpp">C++</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="ruby">Ruby</option>
                      <option value="php">PHP</option>
                      <option value="sql">SQL</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="bash">Bash</option>
                      <option value="json">JSON</option>
                      <option value="yaml">YAML</option>
                      <option value="xml">XML</option>
                    </select>
                    <textarea
                      placeholder="Code"
                      value={ce.code}
                      onChange={(e) => updateCodeExample(index, 'code', e.target.value)}
                      rows={8}
                      className="w-full px-4 py-2 mb-3 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)] font-mono text-sm"
                    />
                    <textarea
                      placeholder="Explanation (optional)"
                      value={ce.explanation}
                      onChange={(e) => updateCodeExample(index, 'explanation', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--ink)]"
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
