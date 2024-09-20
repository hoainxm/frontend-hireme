FROM node:18-bookworm as builder                                                                                                                                                  
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build /app
RUN npm install -g serve
EXPOSE 3000
CMD [ "serve", "-s", "/app", "-l", "3000" ]