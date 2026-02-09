FROM node:18-bullseye AS build
WORKDIR /app

# sadece dependency için
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# prisma
COPY prisma ./prisma
RUN npx prisma generate

# source
COPY . .
RUN npm run build


FROM node:18-bullseye
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 3002
HEALTHCHECK CMD wget -qO- http://localhost:3002/health || exit 1

CMD ["node", "dist/src/main.js"]
