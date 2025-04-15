# Usa a imagem oficial do Node.js
FROM node:20

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn prisma generate

EXPOSE 3333

CMD ["yarn", "dev"]
