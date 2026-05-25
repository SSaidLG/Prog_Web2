# Imagen base ligera de Node
FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero los archivos de dependencias (mejora el cache de Docker)
COPY backend/package*.json ./backend/

# Instalamos las dependencias del backend
WORKDIR /usr/src/app/backend
RUN npm install --omit=dev

# Volvemos a la raiz y copiamos TODO el codigo (backend + frontend)
WORKDIR /usr/src/app
COPY backend ./backend
COPY frontend ./frontend

# Nos posicionamos en el backend para arrancar
WORKDIR /usr/src/app/backend

# El puerto donde corre Express
EXPOSE 3000

# Comando de arranque
CMD ["node", "server.js"]
