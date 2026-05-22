FROM node:24-bookworm-slim AS base

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1
ENV PYTHON_BIN=/usr/bin/python3
ENV DATABASE_URL=file:/data/dev.db

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "mkdir -p /data && npm run db:push && npm run db:seed && npm run start"]
