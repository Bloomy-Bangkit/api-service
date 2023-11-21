FROM node:20.9.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DB_HOST=35.239.213.126
ENV DB_USER=adit
ENV DB_PASS=AdityaBayu!
ENV DB_NAME=bloomy-db
EXPOSE 8080
CMD ["npm", "start"]