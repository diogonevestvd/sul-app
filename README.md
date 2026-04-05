# Northstar — fullstack local build

This version includes:
- local account creation and login
- SQLite database with Prisma
- Portuguese and English UI
- editable workspaces, entries, questions, and plan versions
- silent AI engine with a local fallback and optional OpenAI connection

## 1) Install

```bash
npm install
```

## 2) Create your env file

Duplicate `.env.example` to `.env`.

Required minimum:
```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="use-a-long-random-string"
```

Optional for live AI:
```env
OPENAI_API_KEY="your-key-here"
```

## 3) Prepare the database

```bash
npm run setup
```

## 4) Start the app

```bash
npm run dev
```

Then open `http://localhost:3000`

## Notes

- Without `OPENAI_API_KEY`, the app still works using a local planning engine.
- If you want production auth/database later, this structure can be migrated to Supabase or PostgreSQL.
- Aileron is loaded from a CDN in `app/layout.tsx`. For production, host the font yourself or replace it.
