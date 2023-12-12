FROM node:lts-bullseye

WORKDIR /app

COPY package.json package.json

RUN yarn

ADD "." "."

RUN yarn build

CMD ["yarn", "start"]