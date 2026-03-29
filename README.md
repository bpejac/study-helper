# Dev Study Helper

A personal study helper web application to document and review what I've learned throughout my software development career. Now with **admin editing features** for managing content through a web interface!

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- **📚 Knowledge Subjects** - Organize topics by languages, frameworks, concepts, and more
- **📝 Topic Pages** - Detailed pages with key points and code examples
- **🔍 Search** - Quickly find topics across your entire knowledge base
- **🧠 Quiz Mode** - Test yourself with flashcard-style questions
- **✏️ Admin Panel** - Full CRUD interface for managing subjects, topics, and content
- **💾 Database Storage** - Content stored in SQLite with Prisma ORM
- **🔐 Authentication** - Secure admin login with NextAuth.js

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
# Create .env file with your configuration
cp .env.example .env

# Run database migrations
npx prisma migrate dev
```

4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Default Admin Credentials

After seeding the database, you can log in to the admin panel at `/admin/login`:

- **Username:** `admin`
- **Password:** `admin`

⚠️ **Important:** Change these credentials in production!

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="change-this-to-a-random-secret-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Admin Panel

The admin panel provides a complete content management system:

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Log in with admin credentials
3. Access the dashboard at `/admin`

### Managing Content

- **Subjects**: Create, edit, and delete study subjects at `/admin/subjects` (routes still use `/categories` internally)
- **Topics**: Manage topics with full editing of key points, code examples, and quiz questions at `/admin/topics`
- **Real-time Updates**: Changes are immediately reflected on the public-facing site

### Admin Features

- Visual subject management with color preview
- Rich topic editor with:
  - Multiple key points
  - Code examples with syntax highlighting
  - Quiz questions for testing
  - Resource links
- Subject filtering for topics
- Confirmation dialogs for deletions
- Responsive design for mobile editing

## Adding Content

### Option 1: Through Admin Panel (Recommended)

1. Log in to `/admin/login`
2. Navigate to Subjects or Topics management
3. Use the web interface to add/edit content

### Option 2: Direct Database Seeding

Edit `prisma/seed.ts` to add content programmatically, then run:

```bash
npx prisma db seed
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── admin/           # Admin panel pages
│   │   ├── subjects/    # Subject management (routes via /categories)
│   │   ├── topics/      # Topic management
│   │   └── login/       # Admin login
│   ├── api/             # API routes
│   │   ├── auth/        # NextAuth endpoints
│   │   ├── categories/  # Subject CRUD
│   │   └── topics/      # Topic CRUD
│   ├── categories/      # Public subject pages
│   ├── topics/          # Public topic pages
│   ├── search/          # Search page
│   ├── quiz/            # Quiz mode
│   └── page.tsx         # Homepage
├── components/          # Reusable React components
├── lib/                 # Utility functions
│   ├── auth.ts         # NextAuth configuration
│   ├── data.ts         # Database queries
│   └── prisma.ts       # Prisma client
├── types/              # TypeScript definitions
└── middleware.ts       # Authentication middleware

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
| `npx prisma db seed` | Seed database with initial data |

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

# 4. Run migrations to create database tables
npx prisma migrate dev

# 5. Seed the database with initial data
npx prisma db seed
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

#### Reseeding Data

If you want to refresh the data without resetting the entire database:

```bash
# Just run the seed script again
npx prisma db seed
```

Note: The seed script uses `upsert` operations, so it will update existing records or create new ones.

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

#### Quick Start with Docker Compose

1. Create a `.env` file with required variables:
```bash
echo 'AUTH_SECRET="your-secure-random-secret-here"' > .env
echo 'AUTH_TRUST_HOST="true"' >> .env
```

2. Start the application:
```bash
docker-compose up -d
```

The app will be available at `http://localhost:3000`. The database and backups are persisted in Docker volumes.

#### What's Included

- **Multi-stage build**: Optimized production image with minimal size
- **SQLite database**: Persisted via Docker volume
- **Automatic backups**: Daily database backups to `/backups` directory
- **Health checks**: Container monitoring and auto-restart
- **Database migrations**: Automatic schema initialization on startup

#### Environment Variables for Docker

- `DATABASE_URL`: Set to `file:/app/data/prisma.db` (configured in docker-compose.yml)
- `AUTH_SECRET`: **Required**. Generate with: `openssl rand -base64 32`
- `AUTH_TRUST_HOST`: Set to `"true"` for Docker environments
- `NEXTAUTH_URL`: Optional, defaults to `http://localhost:3000`

#### Accessing the App

- **Public site**: http://localhost:3000
- **Admin login**: http://localhost:3000/admin/login
- **Default credentials**: admin / admin (⚠️ change in production!)

#### Database Backups

Backups are created daily and stored in `./backups/`. Format: `prisma-YYYYMMDD-HHMMSS.db`

#### Stopping the Application

```bash
docker-compose down

# To also remove the database volume (WARNING: deletes data)
docker-compose down -v
```

#### Viewing Logs

```bash
docker-compose logs -f study-helper
```

#### Advanced Docker Commands

```bash
# Rebuild the image
docker-compose build --no-cache

# Run database migrations in container
docker-compose exec study-helper npx prisma migrate deploy

# Open Prisma Studio in container
docker-compose exec study-helper npx prisma studio

# Execute custom commands
docker-compose exec study-helper npm run lint
```