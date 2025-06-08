#* ================================
#* BASE STAGE - Configuración común
#* ================================
FROM node:22-alpine AS base

# Establecer directorio de trabajo
WORKDIR /app

# Habilitar y preparar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar archivos de configuración de pnpm
COPY package.json pnpm-lock.yaml ./

#* ================================
#* DEPENDENCIES STAGE - Instalar dependencias
#* ================================
FROM base AS deps

# Instalar todas las dependencias (dev + prod)
RUN pnpm i --frozen-lockfile

#* ================================
#* DEVELOPMENT STAGE - Para desarrollo
#* ================================
FROM base AS development

# Copiar node_modules desde deps
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3100

# Comando para desarrollo con hot reload
CMD ["pnpm", "start:dev"]

#* ==================================
#* BUILD STAGE - Construir aplicación
#* ==================================
FROM deps AS build

COPY . .

# Build de la aplicación
RUN pnpm build

#* ==================================
#* PRODUCTION STAGE - Para producción
#* ==================================
FROM node:22-alpine AS production

WORKDIR /app

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar el resultado del build y el package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Instalar solo dependencias de producción basado en el lockfile
RUN pnpm i --prod --frozen-lockfile

# Copiar archivos de configuración
COPY --from=build /app/environments ./environments

# Exponer puerto
EXPOSE 3200

# Comando para producción
CMD ["node", "dist/main"]