ARG NODE_VERSION=22
#* =============================================
#* 1. STAGE: BASE - Configuración común mínima
#* =============================================
# Usamos una versión específica para builds reproducibles
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
# Habilitar pnpm, que viene con Node >= 16.9
RUN corepack enable

#* ========================================================
#* 2. STAGE: DEV_DEPENDENCIES - Instalar TODAS las dependencias
#* ========================================================
# Esta etapa instala todo (dev + prod) y servirá de base para el build y el desarrollo local
FROM base AS dev-deps
COPY package.json pnpm-lock.yaml ./
# Instala TODAS las dependencias. El caché se romperá solo si estos archivos cambian.
RUN pnpm i --frozen-lockfile

#* =============================================
#* 3. STAGE: DEVELOPMENT - Para desarrollo local
#* =============================================
# Esta es la imagen que construirás localmente con --target=development
FROM dev-deps AS development
# Copia todo el código fuente. Esto permite el hot-reloading.
COPY . .
# Expone el puerto de desarrollo
ENV PORT=3100
ENV HOST_PORT=3500

EXPOSE ${PORT}
 
# Comando para desarrollo con hot reload
CMD ["pnpm", "run", "start:dev"]

#* =============================================
#* 4. STAGE: BUILD - Compilar el código TypeScript
#* =============================================
# Usa la etapa dev-deps como base, que ya tiene todas las dependencias necesarias para compilar.
FROM dev-deps AS build
# Copia el código fuente
COPY . .
# Ejecuta el build
RUN pnpm build

#* ==============================================================
#* 5. STAGE: PROD_DEPENDENCIES - Preparar dependencias de producción
#* ==============================================================
# Usa la etapa de build como base, que ya tiene todo.
FROM build AS prod-deps
# 'pnpm prune --prod' es la forma más eficiente de eliminar las devDependencies
# sin tener que reinstalar todo.
RUN pnpm prune --prod

#* =============================================
#* 6. STAGE: PRODUCTION - La imagen final y optimizada
#* =============================================
FROM base AS production
# Copia las dependencias de producción ya limpias desde la etapa 'prod-deps'.
COPY --from=prod-deps /app/node_modules ./node_modules
# Copia el código compilado desde la etapa 'build'.
COPY --from=build /app/dist ./dist
# Copia package.json por si algún paquete lo necesita en runtime.
COPY package.json .
# Copia tus archivos de configuración.
COPY --from=build /app/environments ./environments

# Establece el usuario a 'node' por seguridad.
USER node

# Expone el puerto que tu aplicación escuchará
EXPOSE 3000

# El comando final para ejecutar la aplicación.
CMD ["node", "dist/main.js"]