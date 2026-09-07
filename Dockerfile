FROM node:24-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server
ENV DATABASE_PATH=/app/data/blog.db
EXPOSE 3000
VOLUME ["/app/data"]
CMD ["npm", "start"]
