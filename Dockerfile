FROM node:20.17-alpine
WORKDIR /app/backend
COPY ./package*.json /app/backend/
RUN npm install --verbose
ENTRYPOINT [ "npm", "start" ]
EXPOSE 3001