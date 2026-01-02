FROM node:18-alphine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alphine AS production
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3002
CMD ["node", "dist/main"]