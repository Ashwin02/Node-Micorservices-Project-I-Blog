# Specify Base Image

From node:alpine
ENV CI=true
WORKDIR /app
# Install Dependencies

COPY ./package.json ./
RUN npm install
COPY ./ ./

# Default commands

CMD ["npm", "start"]