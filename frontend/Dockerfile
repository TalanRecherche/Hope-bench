FROM node:18-alpine

WORKDIR /app

COPY ./ /app/

RUN npm install -g npm@10.5.0
RUN npm ci

EXPOSE 8080

# Script launched on startup, used to add configuration to frontend part at runtime, not build
COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "run", "dev"]
