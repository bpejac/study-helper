import { Topic } from '@/types';

export const nextjsConcepts: Topic = {
  id: 'nextjs-concepts',
  title: 'Next.js: Server vs Client Components',
  description: 'Understanding the React Server Components (RSC) architecture in Next.js App Router.',
  category: 'frontend',
  confidence: 'intermediate',
  keyPoints: [
    {
      title: 'Server Components (Default)',
      description: 'In the App Router, **all components are Server Components by default**. They render exclusively on the server and send **HTML + RSC payload** (not JavaScript) to the client:\n\n- **Direct backend access**: can query databases, read files, access environment variables (`process.env.DB_URL`) — no API routes needed\n- **`async` components**: since they run in Node.js, you can `await` directly in the component body — `const data = await db.query(...)`\n- **Zero client JS**: their code is never sent to the browser, reducing bundle size. Heavy libraries (markdown parsers, syntax highlighters) have zero client cost.\n- **No hooks or event handlers**: `useState`, `useEffect`, `onClick` are **not available** — these require a browser runtime.\n- **Streaming**: Server Components can **stream** their output, showing parts of the page as they become ready (via `<Suspense>` boundaries).',
    },
    {
      title: 'Client Components',
      description: 'Marked with **`"use client"`** directive at the top of the file. These are standard React components that are **hydrated** in the browser:\n\n- The directive creates a **client boundary** — the component and **all its imports** become client code\n- Used for **interactivity**: `useState`, `useEffect`, `useContext`, event handlers (`onClick`, `onChange`), browser APIs (`window`, `localStorage`)\n- They are still **server-rendered** initially (SSR for fast first paint), then hydrated on the client\n- Should be kept as **leaf nodes** — push `"use client"` as far down the component tree as possible to minimize client JS\n- Can receive **serializable props** from Server Components (strings, numbers, JSON objects — not functions or classes)',
    },
    {
      title: 'The Server/Client Boundary',
      description: 'Understanding the **composition boundary** is critical:\n\n- **Server → Client**: You **can** import and render a Client Component inside a Server Component (pass data as props)\n- **Client → Server**: You **cannot** import a Server Component inside a Client Component. But you **can** pass a Server Component as `children` or a prop (the **"donut" pattern**):\n\n```\n// ✅ Server Component passed as children\n<ClientLayout>          // "use client"\n  <ServerSidebar />     // Server Component rendered by parent\n</ClientLayout>\n```\n\n- Props crossing the boundary must be **serializable** (JSON-safe). You can\'t pass functions, `Date` objects (use ISO strings), or class instances.\n- The boundary is a **module-level** concept — `"use client"` marks the **file**, not individual components.',
    },
    {
      title: 'Data Fetching Patterns',
      description: 'Next.js App Router changes how data fetching works compared to Pages Router:\n\n- **Server Components**: fetch directly in the component body with `async/await`. No `getServerSideProps` or `getStaticProps` needed.\n- **`fetch()` extensions**: Next.js extends the native `fetch` with caching: `fetch(url, { cache: \'force-cache\' })` (static, default), `{ cache: \'no-store\' }` (dynamic), `{ next: { revalidate: 60 } }` (ISR — revalidate every 60s)\n- **Request deduplication**: multiple components fetching the same URL in one render are **automatically deduplicated** — React caches the promise.\n- **Parallel data fetching**: use `Promise.all()` in a single component, or fetch in **parallel layouts/pages** (each segment fetches independently)\n- **Server Actions** (`"use server"`): functions that run on the server but can be called from client components — used for mutations (form submissions, database writes). Marked with `"use server"` directive.',
    },
    {
      title: 'Routing & Layouts',
      description: 'The **App Router** uses a **file-system based** routing with special file conventions:\n\n- **`page.tsx`**: defines a route segment\'s UI (required to make a route accessible)\n- **`layout.tsx`**: shared UI that wraps child pages. **Persists across navigation** — doesn\'t remount. Root layout is required and must include `<html>` and `<body>` tags.\n- **`loading.tsx`**: automatic `<Suspense>` boundary wrapping the page — shows while the page is loading\n- **`error.tsx`**: Error Boundary for the segment — catches errors and shows fallback UI (must be `"use client"`)\n- **`not-found.tsx`**: shown when `notFound()` is called\n- **Route Groups**: `(groupName)` folders organize routes without affecting URLs\n- **Dynamic Routes**: `[slug]` for params, `[...slug]` for catch-all, `[[...slug]]` for optional catch-all\n- **Parallel Routes**: `@modal` slots for rendering multiple pages simultaneously (modals, split views)\n- **Intercepting Routes**: `(.)photo` intercepts navigation to show a modal overlay while the URL changes',
    },
    {
      title: 'Caching & Revalidation',
      description: 'Next.js has an **aggressive multi-layer caching** system (App Router):\n\n- **Request Memoization**: within a single server render, duplicate `fetch()` calls to the same URL are deduped (React cache)\n- **Data Cache**: `fetch()` results are cached by default (`force-cache`). Persists across requests and deployments. Opt out with `cache: \'no-store\'` or `revalidate: 0`.\n- **Full Route Cache**: statically rendered routes are cached as HTML + RSC payload at build time. Dynamic routes (using `cookies()`, `headers()`, `searchParams`) skip this.\n- **Router Cache**: client-side cache of visited routes. Prefetched routes (via `<Link>`) are cached for 30s (dynamic) or 5min (static). `router.refresh()` invalidates it.\n\n**Revalidation strategies**:\n- **Time-based**: `fetch(url, { next: { revalidate: 60 } })` or `export const revalidate = 60` at the page level (ISR)\n- **On-demand**: `revalidatePath(\'/blog\')` or `revalidateTag(\'posts\')` in Server Actions or Route Handlers — for instant cache invalidation after mutations',
    },
  ],
  quizQuestions: [
    {
      question: 'What is the main benefit of Server Components?',
      answer: 'They reduce JavaScript bundle size sent to the client since their code never runs in the browser. They can also directly access backend resources (databases, file system) without API calls, and heavy dependencies (markdown parsers, etc.) have zero client-side cost.',
    },
    {
      question: 'Why can\'t you use useState in a Server Component?',
      answer: 'Server Components render once on the server and send HTML to the client. They have no browser runtime and no persistent instance — hooks like useState and useEffect require a client-side React runtime to manage state and effects across re-renders.',
    },
    {
      question: 'What does "use client" directive do?',
      answer: 'It marks a file as a Client Component boundary. The component AND all its imports become client code, bundled for the browser. It can then use hooks, event handlers, and browser APIs. The component is still SSR\'d initially but hydrated on the client.',
    },
    {
      question: 'Why are async components possible in Next.js App Router?',
      answer: 'Server Components run in a Node.js environment on the server, so they can use async/await directly in the component body to fetch data before rendering. This is not possible in Client Components because React\'s rendering model requires synchronous function returns.',
    },
    {
      question: 'Can you import a Server Component inside a Client Component?',
      answer: 'No, you cannot directly import a Server Component into a Client Component — it would become client code. However, you can pass a Server Component as children or a prop (the "donut" pattern): <ClientWrapper><ServerComponent /></ClientWrapper>. The Server Component is rendered by the parent Server Component and passed down.',
    },
    {
      question: 'What is the difference between cache: "force-cache" and cache: "no-store" in Next.js fetch?',
      answer: 'force-cache (default) caches the response in the Data Cache — it persists across requests and deployments, making the route statically rendered. no-store skips caching entirely, making the route dynamically rendered on every request. Use no-store for user-specific or real-time data.',
    },
    {
      question: 'What is the purpose of layout.tsx in the App Router?',
      answer: 'layout.tsx defines shared UI (navigation, sidebars) that wraps child pages and persists across navigation — it does NOT remount when navigating between pages that share the layout. The root layout is required and must include <html> and <body> tags. Layouts can also fetch data and are Server Components by default.',
    },
    {
      question: 'What is on-demand revalidation and when would you use it?',
      answer: 'On-demand revalidation (revalidatePath or revalidateTag) immediately invalidates the cache for specific routes or tagged data. Use it after mutations (form submissions, CMS webhooks) when you need the cache to update instantly rather than waiting for time-based revalidation.',
    },
    {
      question: 'What are Server Actions and how do they work?',
      answer: 'Server Actions are functions marked with "use server" that run on the server but can be called from Client Components. They\'re used for mutations (form submissions, database writes). Next.js creates an API endpoint automatically. They can be passed as the action prop on <form> or called directly in event handlers.',
    },
    {
      question: 'What is the difference between loading.tsx and Suspense?',
      answer: 'loading.tsx is syntactic sugar — Next.js automatically wraps the page in a <Suspense> boundary with loading.tsx as the fallback. You can also use <Suspense> manually for more granular control, wrapping individual components within a page to show different loading states for different sections.',
    },
    {
      question: 'What props can you pass from Server to Client Components?',
      answer: 'Only serializable values: strings, numbers, booleans, null, arrays, plain objects, Date (as ISO strings), and other JSON-safe values. You CANNOT pass functions, class instances, DOM nodes, or Map/Set. This is because the data crosses a network boundary (server → client).',
    },
    {
      question: 'What is the Router Cache and how does it affect navigation?',
      answer: 'The Router Cache is a client-side in-memory cache of visited route segments (RSC payload). Prefetched routes via <Link> are cached for 30 seconds (dynamic routes) or 5 minutes (static routes). This makes back/forward navigation instant. Use router.refresh() to invalidate it.',
    },
  ],
  codeExamples: [
    {
      title: 'Server Component with Data Fetching',
      language: 'typescript',
      code: `// app/posts/[id]/page.tsx — Server Component by default
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { LikeButton } from '@/components/LikeButton'; // Client Component
import { CommentSection } from '@/components/CommentSection'; // Client Component

// Metadata is also async in the App Router
export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await db.post.findUnique({ where: { id: params.id } });
  return { title: post?.title ?? 'Post Not Found' };
}

// This component is async — runs entirely on the server
export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await db.post.findUnique({ 
    where: { id: params.id },
    include: { author: true, comments: true }
  });

  if (!post) notFound(); // Renders not-found.tsx

  return (
    <article>
      <h1>{post.title}</h1>
      <p className="text-gray-500">By {post.author.name}</p>
      
      {/* Markdown library stays server-side (zero client JS) */}
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
      
      {/* Client Components for interactivity */}
      <LikeButton postId={post.id} initialCount={post.likes} />
      <CommentSection 
        postId={post.id} 
        initialComments={post.comments} // serializable data only
      />
    </article>
  );
}`,
      explanation: 'Server Components fetch data directly with async/await. Heavy libraries like markdown renderers stay server-side. Client Components handle interactivity and receive only serializable props.',
    },
    {
      title: 'Server Actions for Mutations',
      language: 'typescript',
      code: `// app/actions.ts
'use server'; // All exports are Server Actions

import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.post.create({ data: { title, content } });
  
  // Invalidate cache so the posts list shows the new post
  revalidatePath('/posts');
}

export async function toggleLike(postId: string) {
  await db.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } }
  });
  revalidatePath(\`/posts/\${postId}\`);
}

// --- Client Component using Server Actions ---
// components/CreatePostForm.tsx
'use client';
import { useFormStatus } from 'react-dom';
import { createPost } from '@/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus(); // hook for form submission state
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}

export function CreatePostForm() {
  return (
    <form action={createPost}> {/* Server Action as form action */}
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <SubmitButton />
    </form>
  );
}`,
      explanation: 'Server Actions replace API routes for mutations. They run on the server but can be called from Client Components via form actions or direct invocation. revalidatePath invalidates the cache after the mutation.',
    },
    {
      title: 'The "Donut" Pattern & Composition',
      language: 'typescript',
      code: `// ---- Pattern: Pass Server Components as children to Client Components ----

// components/ClientSidebar.tsx
'use client';
import { useState, ReactNode } from 'react';

export function CollapsibleSidebar({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <aside className={isOpen ? 'w-64' : 'w-0'}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '◀' : '▶'}
      </button>
      {isOpen && children} {/* Server Components rendered here! */}
    </aside>
  );
}

// app/layout.tsx — Server Component
import { CollapsibleSidebar } from '@/components/ClientSidebar';
import db from '@/lib/db';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Fetched on the server — never reaches the client
  const navItems = await db.navItem.findMany();

  return (
    <html lang="en">
      <body className="flex">
        {/* "Donut" pattern: Server content inside Client shell */}
        <CollapsibleSidebar>
          <nav>
            {navItems.map(item => (
              <a key={item.id} href={item.url}>{item.label}</a>
            ))}
          </nav>
        </CollapsibleSidebar>
        
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}`,
      explanation: 'The "donut" pattern lets you use Server Components inside Client Components by passing them as children. The server-rendered nav (with DB data) is passed as children to the interactive client sidebar. The Server Component is rendered by the parent layout (a Server Component), not by the Client Component.',
    },
  ],
};