# Base Stage
FROM node:20-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development Stage
FROM base as dev
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Build Stage
FROM base as build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production Stage
FROM nginx:alpine as prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
