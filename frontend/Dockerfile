FROM node:22-alpine

# Installation de Git pour les dépendances GitHub
RUN apk add --no-cache git

WORKDIR /app

COPY package.json package-lock.json ./

# Utiliser npm install au lieu de npm ci pour éviter les problèmes de synchronisation
RUN npm install

COPY . .

RUN npm run build

CMD ["tail", "-f", "/dev/null"]
