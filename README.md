# IEEE Computer Society — Nirma University

Official web hub for the IEEE Computer Society Student Chapter at Nirma University.

## Tech Stack

- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **State / Data**: TanStack Query
- **Backend / Data**: Supabase (Postgres + Auth + Storage ready)

## Getting Started

```bash
# Install dependencies
npm install

# Add env vars
cp .env.example .env

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
| `npm run test`    | Run unit tests           |

## Project Structure

```
src/
├── assets/        # Images and static assets
├── components/    # Reusable UI components
├── pages/         # Route-level page components
├── hooks/         # Custom React hooks
└── lib/           # Utility functions
```

## Dynamic Backend Setup

This repo is now prepared to fetch event content and board member content from Supabase.

### 1. Create Supabase project

- Create a new Supabase project.
- Copy the project URL and anon key into `.env` using `.env.example`.

### 2. Create the events table

- Open the Supabase SQL editor.
- Run [supabase/schema.sql](supabase/schema.sql).

### 3. Current dynamic scope

- [src/pages/Events.tsx](src/pages/Events.tsx) now loads events through React Query.
- [src/pages/BoardMembers.tsx](src/pages/BoardMembers.tsx) now loads board members through React Query.
- If Supabase is not configured yet, the page falls back to seeded demo data so the app still works.

### 4. Next backend slices

- Gallery images
- Contact form submissions
- Site settings and social links
