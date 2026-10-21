# Install dependencies separately to keep the build cache effective.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js application.
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_GITHUB_USERNAME
ENV NEXT_PUBLIC_GITHUB_USERNAME=$NEXT_PUBLIC_GITHUB_USERNAME

ARG NEXT_PUBLIC_LANGFLOW_API_KEY
ENV NEXT_PUBLIC_LANGFLOW_API_KEY=$NEXT_PUBLIC_LANGFLOW_API_KEY

ARG NEXT_PUBLIC_LANGFLOW_ENDPOINT
ENV NEXT_PUBLIC_LANGFLOW_ENDPOINT=$NEXT_PUBLIC_LANGFLOW_ENDPOINT

ARG NEXT_PUBLIC_LANGFLOW_FLOW_ID
ENV NEXT_PUBLIC_LANGFLOW_FLOW_ID=$NEXT_PUBLIC_LANGFLOW_FLOW_ID

ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID

ARG NEXT_PUBLIC_CLARITY_PROJECT_ID
ENV NEXT_PUBLIC_CLARITY_PROJECT_ID=$NEXT_PUBLIC_CLARITY_PROJECT_ID

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Run the standalone Next.js server.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
