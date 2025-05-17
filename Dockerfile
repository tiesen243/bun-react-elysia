# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app

# install dependencies
COPY package.json bun.lock ./
RUN bun install

# copy the rest of the app
COPY . .

# run the app
EXPOSE 3000/tcp
CMD ["bun", "start"]
