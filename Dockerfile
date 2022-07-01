FROM node:16-alpine AS builder

ENV WORKDIR=/todoq

COPY . $WORKDIR

WORKDIR $WORKDIR

RUN npm ci --legacy-peer-deps

RUN npm run build

FROM nginx:alpine

COPY -r --from=builder /todoq/build/* /usr/share/nginx/html/

EXPOSE 80