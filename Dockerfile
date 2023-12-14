# Use the official Node.js LTS (Long Term Support) image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

ARG NODE_ENV=production

# Command to run the application
CMD ["npm", "run", "start"]
