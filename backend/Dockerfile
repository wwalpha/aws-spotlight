# build stage
FROM node:14-alpine as Build

WORKDIR /app

COPY . .

RUN yarn install && \
  yarn build

# release stage
FROM node:14-alpine

WORKDIR /app

COPY --from=Build /app/dist .
COPY package.json .

# install production libraries
RUN yarn install --production --no-lockfile

# Entry Point
ENTRYPOINT ["node", "app.js"]