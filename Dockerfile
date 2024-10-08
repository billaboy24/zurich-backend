FROM node:20.11.1-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run lint

RUN npm run build

EXPOSE 3000

CMD [ "npm","run","start:prod" ]