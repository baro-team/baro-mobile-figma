FROM node:22.13-alpine AS build

WORKDIR /app

RUN npm install --global pnpm@10.33.2 && npm cache clean --force

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG VITE_KAKAO_MAP_APP_KEY
ENV VITE_KAKAO_MAP_APP_KEY=${VITE_KAKAO_MAP_APP_KEY}
RUN pnpm build

FROM nginx:1.27-alpine

ENV BACKEND_API_BASE_URL=https://dev.barocloud.com
ENV KAKAO_REST_API_KEY=
ENV NGINX_ENVSUBST_FILTER="^(BACKEND_API_BASE_URL|KAKAO_REST_API_KEY)$"

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/10-validate-env.sh /docker-entrypoint.d/10-validate-env.sh
RUN chmod +x /docker-entrypoint.d/10-validate-env.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
