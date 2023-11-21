FROM node:lts
WORKDIR /var/app

COPY ./package*.json ./
RUN npm install

ENV PORT 80

ENTRYPOINT [ "npm", "run", "dev" ]