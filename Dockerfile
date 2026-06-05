FROM node:22.13-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:1.27-alpine

ENV BACKEND_API_BASE_URL=https://dev.barocloud.com
ENV KAKAO_REST_API_KEY=
ENV NGINX_ENVSUBST_FILTER="^(BACKEND_API_BASE_URL|KAKAO_REST_API_KEY)$"

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
