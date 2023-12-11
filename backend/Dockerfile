FROM node:lts-bullseye

WORKDIR /app

COPY package.json package.json

RUN yarn

ADD "." "."

RUN yarn db:generate

RUN yarn build

CMD ["bash", "up.sh"]