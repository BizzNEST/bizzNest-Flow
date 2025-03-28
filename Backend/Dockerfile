FROM node:latest

# Install system dependencies for bcrypt (Updated with apt-get update)
RUN apt-get update && apt-get install -y \
    build-essential \
    make \
    automake \
    gcc \
    g++ \
    cpp \
    libkrb5-dev \
    libc6-dev \ 
    man-db \
    autoconf \
    pkg-config \
    default-mysql-client \  
    && rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size
        
# Set the working directory inside the container 
WORKDIR /app   
   
# Copy package.json and package-lock.json first (to cache dependencies)
COPY package*.json ./

# Install dependencies, ensuring bcrypt is built from source
RUN npm install --build-from-source bcrypt

# Copy everything from your project directory into the container
COPY . .  
  
# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
