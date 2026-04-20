# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 4000 (Turbopack)
npm run build     # Production build
npm run lint      # ESLint

npx prisma migrate dev    # Create and apply migrations
npx prisma db seed        # Seed with default admin (admin/admin)
npx prisma studio         # Visual DB editor
npx prisma migrate reset  # Reset DB — deletes all data
```

No test suite is configured.

## Tech Stack

- **Next.js 16** (App Router) with React 19, TypeScript, Turbopack
- **Tailwind CSS 4** with PostCSS
- **Prisma 7** with SQLite (`better-sqlite3` adapter) — DB file at `prisma/dev.db`
- **NextAuth.js 5 beta** — credentials provider, JWT sessions
- **react-markdown** + remark-gfm + remark-breaks for markdown rendering
- **prism-react-renderer** for code syntax highlighting

## Architecture

### App Router Structure

```
src/app/
  (public pages)  /categories, /categories/[id], /topics/[id],
                  /search, /quiz, /quiz-questions, /favorites, /overview
  /login          Admin login
  /api/           REST endpoints (categories, topics, topics/[id]/key-points,
                  /code-examples, /quiz-questions, /search, /auth/[...nextauth])
```

### Data Flow

- **Server components** fetch data via `src/lib/data.ts` (Prisma queries with data transformations)
- **Client components** call API routes with `fetch()`; mutations trigger `router.refresh()` for revalidation
- **Authentication**: `auth()` in API routes/server components; `useSession()` in client components
- All API POST/PUT/DELETE endpoints are protected — anonymous users get read-only access

### Database Models

`Admin` → `Category` → `Topic` → `KeyPoint | CodeExample | QuizQuestion`

All topic child models have an `order` field. Deleting a topic cascades to children.

### Editing UX

There is no separate admin panel. Authenticated users see inline edit/delete buttons directly on public pages. Editing is done through modals (`src/components/editor/`). The public-facing UI and the admin editing surface are the same pages.

### Key Files

| File | Purpose |
|---|---|
| `src/lib/data.ts` | All DB query functions |
| `src/lib/auth.ts` | NextAuth config |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/types/index.ts` | Shared TypeScript interfaces |
| `src/app/globals.css` | CSS variables for light/dark theming |
| `src/components/editor/` | Modal components for content editing |

### Theming

Light/dark mode is implemented via CSS custom properties in `globals.css`. The React compiler Babel plugin is enabled in `next.config.ts`.

## Environment Variables

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```
