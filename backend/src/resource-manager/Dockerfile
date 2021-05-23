FROM node:14-alpine
WORKDIR /app

COPY dist .
COPY package.json .

RUN yarn install --production --no-lockfile

EXPOSE 8080

CMD [ "yarn", "start"]

# # Build Stage
# FROM node:14-alpine as build

# WORKDIR /app

# COPY . .

# RUN yarn install 
# RUN yarn build

# # Release Stage
# FROM node:14-alpine
# WORKDIR /app

# COPY --from=build /app/dist .
# COPY package.json .

# RUN yarn install --production --no-lockfile

# EXPOSE 8080

# CMD [ "yarn", "start"]