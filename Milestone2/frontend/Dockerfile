FROM node:lts
WORKDIR /var/app

COPY package*.json ./
RUN npm install
COPY . ./

# I don't know why installing vite seperately is neccecary,
#  but NPM just silently refuses to build if I don't
RUN npm install vite
RUN npm run build

ENV PORT 80

ENTRYPOINT [ "npm", "start"]