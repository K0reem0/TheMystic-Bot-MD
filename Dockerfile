FROM node:lts-buster

# Install system dependencies
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to optimize layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Run the postinstall script manually to ensure it works
RUN node pipdeps.js

# Copy all other project files, including pipdeps.js
COPY . .

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "index.js", "--server"]
