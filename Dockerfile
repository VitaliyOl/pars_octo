FROM node:18

WORKDIR /app

RUN npm cache clean --force

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth

RUN apt-get update && apt-get install -y curl gnupg --no-install-recommends \
    && curl -sL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY . .

ENV IS_DOCKER=true

ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]
