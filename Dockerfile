FROM node:16

WORKDIR /src/path/app

COPY package*.json ./

RUN yarn add

COPY . .

ARG EnvironmentVariable

CMD ["node" , "."]