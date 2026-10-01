# syntax=docker/dockerfile:1
# Portal: shell + microUIs (Native Federation) compilados y servidos por nginx.
# Un solo origen: /              → shell
#                 /mfe/catalog/       → remote mfe-catalog
#                 /mfe/collaborators/ → remote mfe-collaborators
#                 /api, /auth         → BFF (proxy)

FROM node:24-alpine AS build
ENV NG_CLI_ANALYTICS=false CI=true
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY angular.json tsconfig.json ./
COPY projects ./projects
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/proxy-headers.inc /etc/nginx/conf.d/proxy-headers.inc
COPY docker/starting.html /usr/share/nginx/html/starting.html
COPY --chmod=755 docker/40-federation-manifest.sh /docker-entrypoint.d/40-federation-manifest.sh
COPY --from=build /app/dist/shell/browser/ /usr/share/nginx/html/
COPY --from=build /app/dist/mfe-catalog/browser/ /usr/share/nginx/html/mfe/catalog/
COPY --from=build /app/dist/mfe-collaborators/browser/ /usr/share/nginx/html/mfe/collaborators/
ENV PORTAL_PUBLIC_ORIGIN=http://localhost:4200 \
    BFF_UPSTREAM=http://bff:3000
EXPOSE 80
