# Use a imagem do Node.js
FROM node:20-alpine

# Crie e defina o diretório do app no container
WORKDIR /app

# Copie os arquivos de pacotes
COPY package.json yarn.lock ./

# Instale as dependências
RUN yarn install --frozen-lockfile

# Copie os arquivos compilados para dentro do container
COPY dist ./dist

# Exponha a porta que seu app vai rodar
EXPOSE 3333

# Comando para iniciar a aplicação (usando o JavaScript compilado)
CMD ["node", "dist/main.js"]
