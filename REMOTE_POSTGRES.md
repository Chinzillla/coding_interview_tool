# Remote Postgres Setup

Use this when you want to run the app locally on any computer while storing account, schedule, attempts, and progress in one hosted database.

## Recommended Free Options

- Neon: serverless Postgres with a free tier and pooled connection strings.
- Supabase: hosted Postgres with a free plan.

Neon is the simplest fit for this app because the app only needs Postgres.

## Create the Database

1. Create a free Neon or Supabase project.
2. Copy the Postgres connection string.
3. Prefer a pooled connection string if the provider gives you one.
4. Keep `sslmode=require` in the URL when the provider includes it.

The URL should look roughly like this:

```text
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Do not commit this URL. It is a database password.

## Local Node Setup

Create or update `.env`:

```env
DATABASE_PROVIDER="postgres"
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-string"
ALLOWED_EMAIL="you@example.com"
SETUP_TOKEN="replace-with-a-long-random-setup-token"
TWO_FACTOR_REQUIRED="true"
ENABLE_CODE_RUNNER="true"
```

Then run:

```powershell
npm install
npm run db:push:postgres
npm run db:seed
npm run dev:postgres
```

Open [http://localhost:3000](http://localhost:3000).

## Docker Setup

```powershell
$DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
$AUTH_SECRET="$([guid]::NewGuid().ToString('N'))$([guid]::NewGuid().ToString('N'))"
$SETUP_TOKEN="$([guid]::NewGuid().ToString('N'))$([guid]::NewGuid().ToString('N'))"
$ALLOWED_EMAIL="you@example.com"

docker build -t coding-interview-study-tool .

docker run -d --name coding-study-tool `
  -p 3000:3000 `
  -e DATABASE_PROVIDER=postgres `
  -e DATABASE_URL="$DATABASE_URL" `
  -e AUTH_SECRET="$AUTH_SECRET" `
  -e SETUP_TOKEN="$SETUP_TOKEN" `
  -e ALLOWED_EMAIL="$ALLOWED_EMAIL" `
  -e TWO_FACTOR_REQUIRED=true `
  -e ENABLE_CODE_RUNNER=true `
  coding-interview-study-tool
```

The container will generate the Postgres Prisma client, apply the schema, seed the 169 problems, and start the app.

## Another Computer

Install Docker or Node, then use the same:

- `DATABASE_PROVIDER=postgres`
- `DATABASE_URL`
- `ALLOWED_EMAIL`
- `SETUP_TOKEN`

Your password, authenticator setup, attempts, progress, and schedule are stored in the remote database.

## Switching Back to SQLite

Set:

```env
DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./dev.db"
```

Then regenerate the SQLite Prisma client:

```powershell
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

## Security Notes

- Treat `DATABASE_URL` like a password.
- Use a strong account password and keep two-step verification enabled.
- This remote database stores your password hash, authenticator secret, schedule, attempts, and progress.
- Free database projects may pause or limit usage depending on provider policy.
