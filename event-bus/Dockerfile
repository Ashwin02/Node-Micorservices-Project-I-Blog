# Specify Base Image

From node:alpine
WORKDIR /app

# Install Dependencies

COPY ./package.json ./
RUN npm install
COPY ./ ./

# Default commands

CMD ["npm", "start"]