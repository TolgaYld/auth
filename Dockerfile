FROM node:18.17.1

WORKDIR /app
COPY package.json .
RUN yarn install --save
COPY . .
EXPOSE 8001
CMD ["npm", "start"]