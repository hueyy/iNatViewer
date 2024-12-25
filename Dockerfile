FROM node:20-alpine AS frontend-build
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY app ./app
RUN pnpm exec vite build app

FROM node:20-alpine AS backend-build
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.node.json ./
COPY server ./server
RUN pnpm exec tsc --build tsconfig.node.json

FROM node:20-alpine
WORKDIR /app
COPY --from=backend-build /app/build ./
COPY --from=backend-build /app/node_modules ./node_modules
CMD node build

FROM caddy:2.9-alpine
RUN apk add --no-cache nodejs npm tini
RUN npm install -g pnpm
WORKDIR /srv
COPY Caddyfile ./
COPY package.json pnpm-lock.yaml ./
COPY --from=frontend-build /app/app/dist ./public
COPY --from=backend-build /app/build ./server
COPY --from=backend-build /app/node_modules ./server/node_modules

ENV BACKEND_PORT=8001
ENV OUTPUT_FOLDER=/srv/public/images

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["sh", "-c", "caddy run & node server/server.js"]