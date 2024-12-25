FROM node:20-slim

WORKDIR /app

COPY package.json /app
COPY index.js /app

RUN npm install

CMD ["npm", "start"]