# Usa a imagem oficial do Node.js
FROM node:20

# Cria o diretório de trabalho
WORKDIR /app

# Copia os arquivos para o container
COPY . .

# Instala as dependências
RUN yarn install

# Gera o Prisma Client (se usar)
RUN yarn prisma generate

# Expõe a porta que seu app usa (ajuste se for diferente)
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["yarn", "dev"]
