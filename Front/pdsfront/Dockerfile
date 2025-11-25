# Étape 1 : build du frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Build production
RUN npm run build

# Étape 2 : serveur Nginx pour servir le frontend
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Supprimer le contenu par défaut
RUN rm -rf ./*

# Copier les fichiers build depuis l'étape précédente
COPY --from=build-frontend /app/dist .

# Copier le fichier de configuration Nginx si besoin
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Lancer Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
