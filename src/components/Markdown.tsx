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
          ul: ({ children }) => <ul className="list-disc list-outside ml-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm">{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-[var(--border)] text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[var(--code-bg)]">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-[var(--border)]">{children}</tr>,
          th: ({ children }) => (
            <th className="border border-[var(--border)] px-3 py-2 text-left font-semibold text-[var(--ink)]">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-[var(--border)] px-3 py-2 text-[var(--ink)]">{children}</td>
          ),
        }}
      >
      {children}
    </ReactMarkdown>
    </div>
  );
}
