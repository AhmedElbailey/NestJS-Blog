# Stage 1: Build stage
FROM node:21 AS builder
WORKDIR /app
COPY ./package.json  ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production stage
FROM node:21 
WORKDIR /app
COPY --from=builder /app/dist  /app/dist
COPY ./package.json  ./
RUN npm install --production
CMD ["node", "./dist/main.js"]