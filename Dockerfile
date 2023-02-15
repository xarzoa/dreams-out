FROM node:14

WORKDIR /app

COPY package*.json ./

RUN yarn add

COPY . .

ARG EnvironmentVariable

CMD ["node" , "."]
