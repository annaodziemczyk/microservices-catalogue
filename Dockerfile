FROM node:10.15.3
EXPOSE 3002
COPY . .
RUN npm install
CMD node app.js