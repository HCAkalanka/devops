FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
# Install only production dependencies to reduce attack surface
RUN npm install --omit=dev
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
