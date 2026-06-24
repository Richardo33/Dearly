# Dearly

Dearly is a personal digital memory binder for remembering meaningful people,
their favorites, wishlist items, diary entries, timeline events, and little
things.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local`, then fill the values:

```bash
ADMIN_CODE=
ADMIN_SESSION_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is used for public reads. Keep
`SUPABASE_SERVICE_ROLE_KEY` server-side only.

## Supabase Setup

1. Open your Supabase project.
2. Go to SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Paste and run `supabase/seed.sql`.
5. Add the Supabase environment variables to `.env.local`.
6. Restart the Next.js dev server.
7. Visit `/api/health/supabase` to verify the connection.

The app reads from Supabase. Use `supabase/seed.sql` for initial data.

## Checks

```bash
npm run lint
npm run build
```
