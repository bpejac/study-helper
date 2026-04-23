# Dev Study Helper

A personal study helper web application to document and review what I've learned throughout my software development career. Now with **admin editing features** for managing content through a web interface!

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- **Knowledge Subjects** - Organize topics by languages, frameworks, concepts, and more
- **Topic Pages** - Detailed pages with key points and code examples
- **Search** - Quickly find topics across your entire knowledge base
- **Quiz Mode** - Test yourself with flashcard-style questions
- **Admin Editing** - Inline CRUD interface on public pages; no separate admin panel
- **Database Storage** - Content stored in SQLite with Prisma ORM
- **Authentication** - Secure admin login with NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/brunottonurb/study-helper.git
cd study-helper
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
# Create .env file with your configuration (see Environment Variables section)

# Run database migrations
npx prisma migrate dev
```

4. Start the development server
```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser.

### Default Admin Credentials

Run database migrations to create the admin user:

- **Username:** `admin`
- **Password:** `admin`

You can then log in at `/login`

⚠️ **Important:** Change these credentials in production!

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="change-this-to-a-random-secret-in-production"
```

## Managing Content

There is no separate admin panel. Once logged in at `/login`, inline edit and delete buttons appear directly on all public pages. Use these to add, edit, and delete categories, topics, key points, code examples, and quiz questions.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   ├── categories/          # Category CRUD
│   │   ├── categories/[id]/     # Single category CRUD
│   │   ├── topics/              # Topic CRUD
│   │   ├── topics/[id]/         # Single topic CRUD
│   │   ├── topics/[id]/key-points/
│   │   ├── topics/[id]/code-examples/
│   │   ├── topics/[id]/quiz-questions/
│   │   └── search/
│   ├── categories/      # Public category pages
│   ├── topics/          # Public topic pages
│   ├── favorites/       # Favorites page
│   ├── login/           # Admin login
│   ├── overview/        # Overview page
│   ├── quiz/            # Quiz mode
│   ├── quiz-questions/  # Quiz questions page
│   ├── search/          # Search page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/          # Reusable React components
│   └── editor/         # Inline editing modals
├── lib/                 # Utility functions
│   ├── auth.ts         # NextAuth configuration
│   ├── data.ts         # Database queries
│   └── prisma.ts       # Prisma client
└── types/              # TypeScript definitions

prisma/
├── schema.prisma       # Database schema
├── seed.ts            # Database seeding
└── migrations/        # Database migrations
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma migrate dev` | Create and apply migrations |
| `npx prisma db seed` | Create default admin user |

## Database Management with Prisma

### Initial Setup (First Time)

When setting up the project for the first time or on a new machine:

```bash
# 1. Install dependencies
npm install

# 2. Create the .env file
cp .env.example .env

# 3. Generate Prisma Client
npx prisma generate

# 4. Run migrations to create database tables and admin user
npx prisma migrate dev
```

### Common Database Tasks

#### Viewing and Editing Data

```bash
# Open Prisma Studio - a visual database editor
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- Browse all tables and data
- Add, edit, and delete records
- Test queries

#### Making Schema Changes

When you need to modify the database structure:

1. Edit `prisma/schema.prisma` to make your changes
2. Create and apply a new migration:

```bash
npx prisma migrate dev --name describe_your_change
```

Example:
```bash
npx prisma migrate dev --name add_user_email
```

#### Resetting the Database

⚠️ **Warning**: This will delete all data!

```bash
# Reset database to clean state
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run the seed script
```

#### Resetting Admin User

If you need to reset the admin user password to the default:

```bash
# Reset the database and recreate the admin user
npx prisma migrate reset
# Say 'yes' to confirm
```

#### Checking Migration Status

```bash
# View current migration status
npx prisma migrate status
```

#### Generating Prisma Client

After pulling changes that include schema modifications:

```bash
# Regenerate the Prisma Client
npx prisma generate
```

### Troubleshooting

**Issue**: "Prisma Client could not be found"
```bash
npx prisma generate
```

**Issue**: "Database schema is not in sync with migrations"
```bash
npx prisma migrate dev
```

**Issue**: Want to start fresh with clean data
```bash
npx prisma migrate reset
# Say 'yes' to confirm
```

**Issue**: Need to backup your database
```bash
# SQLite database is just a file - copy it
cp dev.db dev.db.backup
```

### Production Database Setup

For production deployments:

1. Use a production-grade database (PostgreSQL recommended)
2. Update `DATABASE_URL` in your production environment
3. Update `prisma/schema.prisma` datasource provider if needed
4. Run migrations in production:

```bash
npx prisma migrate deploy
```

Note: `migrate deploy` is used in production (doesn't prompt, doesn't seed).

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://www.prisma.io/) - Database ORM
- [SQLite](https://www.sqlite.org/) - Database (via better-sqlite3)
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Turbopack](https://turbo.build/pack) - Fast bundler

## Deployment

⚠️ **Important Note:** This application now requires a server-side runtime and **cannot be deployed to GitHub Pages** (which only supports static hosting).

### Docker Deployment (Recommended)

The project includes Docker and Docker Compose configuration for easy containerized deployment.

### Docker Compose Deployment

The easiest way to deploy locally or on a VPS:

```bash
# 1. Clone the repository
git clone https://github.com/brunottonurb/study-helper.git
cd study-helper

# 2. Start the application
docker-compose up -d
```

The application will be available at `http://localhost:3000`.

### Production Checklist

1. Create a `.env` file with required variables:
```bash
echo 'AUTH_SECRET="your-secure-random-secret-here"' > .env
echo 'AUTH_TRUST_HOST="true"' >> .env
```

2. Start the application:
```bash
docker-compose up -d
```

3. (Optional) For a custom domain, set:
```yaml
# In docker-compose.yml, update the environment section:
environment:
  NEXTAUTH_URL: "https://your-domain.com"
  AUTH_SECRET: "your-secure-random-secret"
```

#### What's Included

- **Multi-stage build**: Optimized production image with minimal size
- **Automatic migrations**: Database schema initialized on startup
- **SQLite database**: Persisted via Docker volume
- **Optional backups**: Daily backups when the `backup` profile is enabled
- **Health checks**: Container monitoring and auto-restart

#### Environment Variables for Docker

- `DATABASE_URL`: `file:/app/data/prisma.db` (configured in `docker-compose.yml`)
- `AUTH_SECRET`: **Required**. Generate with: `openssl rand -base64 32`
- `AUTH_TRUST_HOST`: Set to `"true"` for Docker environments
- `NEXTAUTH_URL`: Optional, defaults to `http://localhost:3000`

#### Database Path (Docker vs Local)

- Docker deployment uses `DATABASE_URL=file:/app/data/prisma.db`
- Local non-Docker development typically uses `DATABASE_URL=file:./dev.db` (from `.env`)

#### Database Backups

Backups are disabled by default. Enable the `backup` profile when needed.

```bash
# Start app without backup (default)
docker-compose up -d

# Enable backup service
docker-compose --profile backup up -d backup

# Stop backup service
docker-compose stop backup
docker-compose rm -f backup
```

Backups are stored in `./backups/` with format `prisma-YYYYMMDD-HHMMSS.db`.

#### Managing the Docker Deployment

```bash
# View logs
docker-compose logs -f study-helper

# Stop the application
docker-compose down

# Stop and remove app plus database volume (WARNING: deletes data)
docker-compose down -v

# Rebuild the image
docker-compose build --no-cache

# Run database migrations in container
docker-compose exec study-helper npx prisma migrate deploy

# Open Prisma Studio in container
docker-compose exec study-helper npx prisma studio

# Execute custom commands
docker-compose exec study-helper npm run lint

# Copy local dev.db into Docker volume (container must be running)
docker-compose cp dev.db study-helper:/app/data/prisma.db

# Alternative: copy to volume without running container
docker run --rm -v study-helper-db:/app/data -v $(pwd):/host alpine cp /host/dev.db /app/data/prisma.db
```