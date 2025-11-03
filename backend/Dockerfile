# Usa imagem oficial do Node.js LTS (v18 ou superior)
FROM node:18

# Define diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o código do backend
COPY . .

# Expõe a porta que o backend vai rodar (ex: 4000)
EXPOSE 4000

# Comando para iniciar o servidor
CMD ["npm", "run", "start"]
