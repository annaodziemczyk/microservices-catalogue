FROM node:6.9.2
EXPOSE 3002
COPY . .
RUN npm install
CMD node app.js