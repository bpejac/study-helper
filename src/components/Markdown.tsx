import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  children: string;
  className?: string;
}

export default function Markdown({ children, className = '' }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
        // Inline elements
        strong: ({ children }) => <strong className="font-semibold text-[var(--ink)]">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
          <code className="bg-[var(--code-bg)] text-[var(--ink)] px-1 py-0.5 text-sm font-mono border border-[var(--border)]">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-[var(--code-bg)] text-[var(--ink)] p-4 overflow-x-auto max-w-full font-mono text-sm border border-[var(--border)] my-2 [&>code]:bg-transparent [&>code]:border-0 [&>code]:p-0 [&>code]:whitespace-pre [&>code]:block">
            {children}
          </pre>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-[var(--accent)] hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        // Block elements
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-sm">{children}</li>,
      }}
    >
      {children}
    </ReactMarkdown>
    </div>
  );
}
