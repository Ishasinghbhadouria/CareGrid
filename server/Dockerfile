FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV PORT=5050
ENV NODE_ENV=production

EXPOSE 5050

CMD ["node", "server.js"]
