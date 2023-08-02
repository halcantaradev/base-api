FROM node:18-alpine
LABEL Author="Gestart Team Dev" 
ENV SERVER_HOME=/usr/src/server/
WORKDIR $SERVER_HOME
COPY ./package*.json $SERVER_HOME

RUN npm install pm2 -g

RUN yarn
COPY . $SERVER_HOME
RUN yarn prisma generate
RUN yarn build

EXPOSE 8080

CMD ["pm2-runtime","./dist/src/main.js","--no-autorestart"]