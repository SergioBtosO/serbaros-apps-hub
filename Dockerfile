# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV CONFIG_PATH=/app/data/config.json

COPY --from=build /app/dist ./dist
COPY --from=build /app/data ./data
COPY --from=build /app/public ./public

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
