FROM node:lts

ENV npm_config_arch=x64
ENV npm_config_platform=linuxmusl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

CMD ["pnpm", "start"]
