FROM node

RUN mkdir -p /jsx/out /jsx/src

WORKDIR /jsx

COPY package-lock.json package.json webpack.config.js ./
RUN chown -R node:node .

USER node

RUN git clone https://github.com/cjdowner/interfaces 

RUN npm install

COPY ./ /jsx/src
