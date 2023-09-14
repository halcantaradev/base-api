FROM node:18
LABEL Author="Gestart Team Dev" 
ENV SERVER_HOME=/usr/src/server/
WORKDIR $SERVER_HOME

RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates procps libxss1 \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh

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