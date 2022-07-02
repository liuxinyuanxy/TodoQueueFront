FROM node:16-alpine AS builder

ENV WORKDIR=/todoq

COPY . $WORKDIR

WORKDIR $WORKDIR

RUN npm ci --legacy-peer-deps

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html/

RUN rm -rf ./*

COPY --from=builder /todoq/build ./

RUN rm ./static/js/*.map

EXPOSE 80