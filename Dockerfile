FROM node:20.9.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV SECRET_PASSWORD_SUPERADMIN=Aditya-SuperAdmin@Bloomy
ENV SECRET_KEY=12qwe8ghjasdkdUIOwqPzlEqweRTYs312dd9s3WEIQWINSAazaxcvbnm120QWasdfsadv345as67
ENV MY_EMAIL=c313bsx3054@bangkit.academy
ENV CLIENT_ID=506943622780-dkl3iq5t6pd0d2r4ojpjk24jmt4pha0r.apps.googleusercontent.com
ENV CLIENT_SECRET=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
ENV REDIRECT_URI=https://developers.google.com/oauthplayground
ENV REFRESH_TOKEN=1//04KTfrGXOh49WCgYIARAAGAQSNwF-L9IrswCQDT7mpiqeYe9ruG_GMqGCaVfzt7NrSdWQMA-uFEZk1YlQEsD-vt7BOiAcqNN8F7Y
EXPOSE 8080
CMD ["npm", "run", "start"]