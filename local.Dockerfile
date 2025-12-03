FROM node:24-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /apps

# copy and pack citrineos core
COPY ./citrineos-core ./citrineos-core
RUN cd ./citrineos-core && npm install && npm run build && npm pack --workspace @citrineos/base

COPY ./citrineos-operator-ui ./citrineos-operator-ui

WORKDIR /apps/citrineos-operator-ui

# install citrineos core package
RUN npm install ../citrineos-core/*.tgz

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder

WORKDIR /app

COPY --from=deps /apps/citrineos-operator-ui/node_modules ./node_modules

COPY ./citrineos-operator-ui ./

RUN npm run build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]