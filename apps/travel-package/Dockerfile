# Development stage
FROM node:alpine AS development

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first to leverage Docker
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy configuration files and code
COPY tsconfig.json nest-cli.json ./
COPY apps/travel-package apps/travel-package
COPY libs libs

# Build the project
RUN npm run build travel-package

# Production stage
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy build artifacts from development stage
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/travel-package/main"]