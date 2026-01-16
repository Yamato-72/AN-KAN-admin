# 1) Install deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Next.js standalone を使わない場合でも動くように最低限コピー
COPY --from=builder /app ./

EXPOSE 8080
CMD ["npm", "run", "start"]
