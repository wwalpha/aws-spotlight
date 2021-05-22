# Build Stage
FROM node:14-alpine as build

WORKDIR /app

COPY . .

RUN yarn install 
RUN yarn build

# Release Stage
FROM node:14-alpine
WORKDIR /app

COPY --from=build /app/build .
COPY package.json .

# install dependencies only
RUN yarn install --production --no-lockfile

CMD [ "yarn", "start"]