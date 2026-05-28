# Coding Interview Study Tool

Private Next.js study app for coding interview repetition. It tracks each problem across:

- memory recall
- Python code recall
- time and space complexity recall

The seed includes all 169 questions from the four-week list. The app is intended for local personal use.

## Recommended: Docker Setup

Use Docker when moving this project to another computer. The container includes Node.js, Python 3, the Next.js app, Prisma, and the local SQLite database setup.

If you want progress synced across computers without deploying the web app, use a hosted Postgres database instead. Follow [REMOTE_POSTGRES.md](REMOTE_POSTGRES.md).

Prerequisites:

- Docker Desktop installed and running
- This project folder copied or cloned onto the computer

From the project folder:

```powershell
$AUTH_SECRET="$([guid]::NewGuid().ToString('N'))$([guid]::NewGuid().ToString('N'))"
$SETUP_TOKEN="$([guid]::NewGuid().ToString('N'))$([guid]::NewGuid().ToString('N'))"
$ALLOWED_EMAIL="you@example.com"

docker build -t coding-interview-study-tool .
docker volume create coding-study-data
docker run -d --name coding-study-tool -p 3000:3000 -v coding-study-data:/data -e AUTH_SECRET="$AUTH_SECRET" -e SETUP_TOKEN="$SETUP_TOKEN" -e ALLOWED_EMAIL="$ALLOWED_EMAIL" -e ENABLE_CODE_RUNNER=true coding-interview-study-tool
```

Open [http://localhost:3000](http://localhost:3000). On first run, create your password with the generated setup token and configure the authenticator-app code shown on the login screen. This first account is the only account the app will create.

If you already had an account before two-step verification was added, sign in with your existing email and password. The app will ask for the setup token before it shows the one-time authenticator setup key.

If port `3000` is already being used, map another local port to the container:

```powershell
docker run -d --name coding-study-tool -p 3001:3000 -v coding-study-data:/data -e AUTH_SECRET="$AUTH_SECRET" -e SETUP_TOKEN="$SETUP_TOKEN" -e ALLOWED_EMAIL="$ALLOWED_EMAIL" -e ENABLE_CODE_RUNNER=true coding-interview-study-tool
```

Then open [http://localhost:3001](http://localhost:3001).

The named Docker volume `coding-study-data` stores `/data/dev.db`, which contains your account, progress, attempts, and schedule. Keep using the same volume if you want your progress to persist.

## Docker Commands

Check whether the app is running:

```powershell
docker ps --filter "name=coding-study-tool"
```

View logs:

```powershell
docker logs coding-study-tool
```

Stop the app:

```powershell
docker stop coding-study-tool
```

Start it again with the same data:

```powershell
docker start coding-study-tool
```

If you used `--rm` when starting the container, it is deleted after stopping. Recreate it with the same volume:

```powershell
docker run -d --rm --name coding-study-tool -p 3000:3000 -v coding-study-data:/data -e AUTH_SECRET="$AUTH_SECRET" -e SETUP_TOKEN="$SETUP_TOKEN" -e ALLOWED_EMAIL="$ALLOWED_EMAIL" -e ENABLE_CODE_RUNNER=true coding-interview-study-tool
```

Rebuild after pulling or copying new code:

```powershell
docker stop coding-study-tool
docker rm coding-study-tool
docker build -t coding-interview-study-tool .
docker run -d --name coding-study-tool -p 3000:3000 -v coding-study-data:/data -e AUTH_SECRET="$AUTH_SECRET" -e SETUP_TOKEN="$SETUP_TOKEN" -e ALLOWED_EMAIL="$ALLOWED_EMAIL" -e ENABLE_CODE_RUNNER=true coding-interview-study-tool
```

Reset all local Docker data and start fresh:

```powershell
docker stop coding-study-tool
docker rm coding-study-tool
docker volume rm coding-study-data
docker volume create coding-study-data
docker run -d --name coding-study-tool -p 3000:3000 -v coding-study-data:/data -e AUTH_SECRET="$AUTH_SECRET" -e SETUP_TOKEN="$SETUP_TOKEN" -e ALLOWED_EMAIL="$ALLOWED_EMAIL" -e ENABLE_CODE_RUNNER=true coding-interview-study-tool
```

## Docker Notes

The Docker image sets:

- `DATABASE_PROVIDER=sqlite`
- `DATABASE_URL=file:/data/dev.db`
- `PYTHON_BIN=/usr/bin/python3`
- `NODE_ENV=production`
- `ALLOWED_EMAIL` is the only email that can create or sign in to the account
- `SETUP_TOKEN` is required before creating the first account
- two-step verification is required in production
- `ENABLE_CODE_RUNNER=true` enables Python execution for trusted local Docker use
- the Python runner does not inherit app secrets and runs as a low-privilege Linux user in Docker

The container start command runs:

```powershell
npm run db:push
npm run db:seed
npm run start
```

That means the database schema is applied automatically and the 169 problems are seeded when the container starts. Seeding updates the problem bank without deleting your user progress.

When `DATABASE_PROVIDER=postgres` or `DATABASE_URL` starts with `postgresql://`, the container uses [prisma/schema.postgres.prisma](prisma/schema.postgres.prisma), applies the remote Postgres schema, and seeds the same problem bank there.

## Azure Deployment

Use [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) to deploy this as an Azure App Service custom container with Azure Container Registry and persistent `/home/dev.db` storage. The Azure resources can be provisioned from [infra/main.bicep](infra/main.bicep).

For Azure, keep `ALLOWED_EMAIL` set to your email and use the built-in two-step verification. The code runner executes user-provided Python, so IP restrictions are still recommended if you can use them.

## Local Node Setup

Docker is the easiest path, but you can run without Docker if Node.js and Python 3 are installed locally.

```powershell
npm.cmd install
npm.cmd run db:push
npm.cmd run db:seed
npm.cmd run dev -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000).

## Local Useful Commands

```powershell
npm.cmd run build
npm.cmd audit --omit=dev
npm.cmd run db:reset
```

`db:push` uses Prisma first. If Prisma cannot apply SQLite locally, the script falls back to `prisma/init-sqlite.js`.

## Local Python Runner

The local non-Docker code runner executes Python 3 from your machine. Make sure one of these is true:

- `python3`, `python`, or `py -3` works in the terminal.
- `PYTHON_BIN` in `.env` points to the Python executable.

Example:

```powershell
PYTHON_BIN="C:\Python312\python.exe"
```

Do not commit `.env` or `prisma/dev.db`.
