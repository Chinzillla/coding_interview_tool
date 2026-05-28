FROM node:24-bookworm-slim AS base

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1
ENV PYTHON_BIN=/usr/bin/python3
ENV DATABASE_PROVIDER=sqlite
ENV DATABASE_URL=file:/data/dev.db

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "if [ \"$DATABASE_PROVIDER\" = \"postgres\" ] || printf '%s' \"$DATABASE_URL\" | grep -Eq '^postgres(ql)?://'; then npm run prisma:generate:postgres && npm run db:push:postgres && npm run db:seed && npm run start; else DB_PATH=\"${DATABASE_URL#file:}\"; mkdir -p \"$(dirname \"$DB_PATH\")\" && npm run db:push && npm run db:seed && (chmod 600 \"$DB_PATH\" 2>/dev/null || true) && npm run start; fi"]
