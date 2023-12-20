FROM node:20.9.0-alpine
WORKDIR /app
RUN apk update
RUN apk add --no-cache wget
RUN mkdir -p /credentials
RUN wget -O /credentials/sa-gcs.json https://storage.googleapis.com/bangkitcapstone-bloomy-bucket/service-account/sa-gcs.json
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start"]