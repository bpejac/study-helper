'use client';

import { useEffect, useId, useRef, useState } from 'react';

let renderSeq = 0;

export default function MermaidDiagram({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Unique ID per render call prevents mermaid from finding a stale <svg id="...">
    // already in the DOM (from the previous render) and removing it mid-flight.
    const seq = ++renderSeq;
    const diagramId = `m${id.replace(/[^a-z0-9]/gi, '')}${seq}`;
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default' });
        const { svg } = await mermaid.render(diagramId, children.trim());
        if (ref.current && seq === renderSeq) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (e) {
        if (seq === renderSeq) {
          setError(e instanceof Error ? e.message : 'Diagram error');
        }
      }
    })();
  }, [children, id]);

  if (error) {
    return (
      <pre className="bg-[var(--code-bg)] text-red-500 p-4 text-sm border border-red-300 my-2 overflow-x-auto">
        {error}
      </pre>
    );
  }

  return <div ref={ref} className="my-4 flex justify-center overflow-x-auto" />;
}
