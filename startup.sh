yarn migrate:deploy
yarn seed:prod
pm2 start ./dist/src/sync-consumer.js 
pm2 start ./dist/src/notification-consumer.js 
pm2-runtime ./dist/src/main.js --no-autorestart