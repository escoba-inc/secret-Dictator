# Usamos una imagen oficial de Node.js
FROM node:18

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos
COPY package*.json ./
COPY server.js ./
COPY public ./public

# Instalamos dependencias
RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar el servidor
CMD [ "node", "server.js" ]
