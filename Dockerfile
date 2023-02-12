FROM node:lts-alpine3.17 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npm install -g nodemon

COPY . .  

EXPOSE 11240

CMD ["npm","run","ts"]