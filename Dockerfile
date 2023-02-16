FROM node:16

WORKDIR /app

COPY package*.json ./

RUN yarn add

COPY . .

ARG EnvironmentVariable

CMD ["node" , "."]