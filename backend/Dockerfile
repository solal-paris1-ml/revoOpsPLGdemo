FROM node:18-alpine

WORKDIR /app

# Only copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Now copy the rest of the app
COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
