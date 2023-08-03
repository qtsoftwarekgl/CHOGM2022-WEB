# FROM node:16.15-alpine3.14

# # Set working directory
# WORKDIR /usr/app

# # Copy existing application directory contents
# COPY ["package*.json", "nx.json", "./"]

# RUN npm install

# COPY . .


# RUN npm install -g @nrwl/cli@latest

# RUN nx run chogm-api:build --prod

# EXPOSE 3000
# # start run in production environment
# CMD [ "pm2", "start", "pm2:prod" ]

## CHOGM UI
##### Stage 1
FROM node:16.13.2 as node

ARG env

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-optional
COPY . .
RUN npm install -g @nrwl/cli@latest
RUN npx nx build chogm-ui --configuration ${env}

##### Stage 2
FROM nginx:alpine
VOLUME /var/cache/nginx
EXPOSE 4200
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=node /app/dist/apps/chogm-ui /usr/share/nginx/html
