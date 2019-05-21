FROM node:12.3.0
EXPOSE 3002
COPY . .
RUN npm install
CMD node app.js