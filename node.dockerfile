FROM node:alpine3.17

WORKDIR /home/node

ENV NPM_CONFIG_UPDATE_NOTIFIER=false

COPY --chown=node:node ./vite.config.js ./index.html ./package.json ./package-lock.json ./

ENTRYPOINT sleep 3 && \
if [ $NPM_INSTALL = True ]; then npm install --no-fund; fi && \
npm run dev -- --host
