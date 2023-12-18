# Usar una imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el archivo de configuración de dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el contenido del directorio actual al directorio de trabajo en el contenedor
COPY . .

# Exponer el puerto 3000 (o el puerto que use tu aplicación)
EXPOSE 3000

# Definir el comando para ejecutar la aplicación
CMD ["npm", "start"]