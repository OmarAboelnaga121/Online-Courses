FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Next.js collects telemetry data by default. Disable it.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
