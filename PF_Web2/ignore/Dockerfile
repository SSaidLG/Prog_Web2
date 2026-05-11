# Usamos una versión ligera de Node para no ocupar mucho espacio
FROM node:18-alpine

# Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías
RUN npm install

# Copiamos el resto de tu código fuente
COPY . .

# Exponemos el puerto donde correrá Express
EXPOSE 3000

# El comando para arrancar el servidor
CMD ["node", "server.js"]