FROM node:18-bullseye AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmmirror.com \
 && npm ci

COPY src/prisma ./src/prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

COPY . .
RUN npm run build


FROM node:18-bullseye

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/src/main.js"]
