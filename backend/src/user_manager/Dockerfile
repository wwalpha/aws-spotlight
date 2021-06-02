FROM node:14-alpine
WORKDIR /app

COPY dist .
COPY package.json .

RUN yarn install --production --no-lockfile

EXPOSE 8080

CMD [ "yarn", "start"]
