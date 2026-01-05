FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:18-alpine AS production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3003

HEALTHCHECK CMD wget -qO- http://localhost:3003/health || exit 1
CMD ["node", "dist/main.js"]
