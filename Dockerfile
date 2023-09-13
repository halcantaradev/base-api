FROM node:18
LABEL Author="Gestart Team Dev" 
ENV SERVER_HOME=/usr/src/server/
WORKDIR $SERVER_HOME
COPY ./package*.json $SERVER_HOME
COPY startup.sh .

RUN npm install pm2 -g

RUN yarn
COPY . $SERVER_HOME
RUN yarn prisma generate
RUN yarn build

EXPOSE 8080
EXPOSE 8081

# RUN ["chmod", "+x", "/usr/src/server/startup.sh"]
CMD ["sh","/usr/src/server/startup.sh"]