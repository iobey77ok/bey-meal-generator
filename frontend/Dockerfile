# 1. Use Node.js to run the Vite dev server locally
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 2. Vite default port
EXPOSE 5173

# 3. Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]