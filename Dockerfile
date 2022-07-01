FROM node:16-alpine as builder

ENV WORKDIR=/todoq

COPY . $WORKDIR

WORKDIR $WORKDIR

RUN npm ci --legacy-peer-deps

RUN npm run build

FROM nginx:alpine

COPY --from=builder $WORKDIR/build/* /usr/share/nginx/html

EXPOSE 80