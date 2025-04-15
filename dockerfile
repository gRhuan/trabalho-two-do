# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# Gera o cliente do Prisma
RUN yarn prisma generate

# Transpila TypeScript para JavaScript
RUN yarn tsc

# Etapa de produção
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

# Garante que o Prisma Client funcione corretamente
RUN yarn prisma generate

CMD ["node", "dist/main.js"]
