# 1. Use an official Node.js runtime as the base image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your backend code
COPY . .

# 5. Expose the port your Express app listens on (looks like 3000 based on your brief)
EXPOSE 3000

# 6. Command to run the app
CMD ["node", "server.js"]