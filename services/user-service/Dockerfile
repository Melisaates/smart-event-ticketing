FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY src/prisma ./src/prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

COPY . .
RUN npm run build
RUN npm prune --omit=dev


FROM node:18-alpine AS production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]
