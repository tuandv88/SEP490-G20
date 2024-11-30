FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN rm package-lock.json && npm install
COPY . .

# Nhận các biến môi trường tại thời gian xây dựng
ARG VITE_BASE_URL
ARG VITE_BASE_URL_AUTH
ARG VITE_BASE_URL_CALLBACK
ARG VITE_APP_TITLE
ARG VITE_OAUTH_CLIENT_ID

# Thiết lập các biến môi trường cho Vite
ENV VITE_BASE_URL=$VITE_BASE_URL \
    VITE_BASE_URL_AUTH=$VITE_BASE_URL_AUTH \
    VITE_BASE_URL_CALLBACK=$VITE_BASE_URL_CALLBACK \
    VITE_APP_TITLE=$VITE_APP_TITLE \
    VITE_OAUTH_CLIENT_ID=$VITE_OAUTH_CLIENT_ID

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]