# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the backend application source files
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Command to run the app
CMD ["node", "server.mjs"]
