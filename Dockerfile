FROM node:22-alpine

WORKDIR /app

# Habilitar y preparar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar archivos de configuración primero
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias (incluyendo dependencias de producción)
RUN pnpm i --frozen-lockfile

# Copiar el resto de archivos
COPY . .

# Compilar el proyecto
RUN pnpm build

ENV NODE_ENV=dev
ENV NODE_ENV_PORT=3100

EXPOSE ${NODE_ENV_PORT}

CMD ["pnpm", "start:dev"]