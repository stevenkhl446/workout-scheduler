# Use a Node.js base image with Alpine
FROM node:18-alpine

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Install necessary packages for building certain npm modules and other OS-level dependencies
RUN apk add --no-cache python3 make g++ \
    && ln -sf python3 /usr/bin/python

# Copy package.json and other relevant configuration files first
COPY package*.json ./

# Install npm dependencies
RUN npm i

# Copy the rest of your frontend application source files into the Docker container
COPY . .

# Expose the port the app runs on, adjust if your app uses a different port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]

