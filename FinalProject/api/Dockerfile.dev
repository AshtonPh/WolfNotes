FROM node:lts
# Set working directory
WORKDIR /var/app

# install node modules
COPY ./package*.json ./
RUN npm install

ENV PORT 80

ENTRYPOINT [ "npm", "run", "dev"]