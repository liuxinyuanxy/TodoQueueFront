FROM node:16-alpine AS builder

ENV WORKDIR=/todoq

COPY . $WORKDIR

WORKDIR $WORKDIR

RUN npm ci --legacy-peer-deps

RUN npm run build

RUN ls build/

FROM nginx:alpine

COPY --from=builder /todoq/build/* /usr/share/nginx/html/

EXPOSE 80