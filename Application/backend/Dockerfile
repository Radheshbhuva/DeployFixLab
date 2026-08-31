# Stage 1: Build & TypeScript Compilation
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Security: Run as non-root user
USER node

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
