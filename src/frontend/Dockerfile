FROM node

RUN mkdir -p /js/out/

WORKDIR /js

COPY package.json package-lock.json webpack.config.js .

RUN chown -R node:node .

USER node
RUN npm install
