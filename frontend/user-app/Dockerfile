FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN rm package-lock.json && npm install

# Nhận các biến môi trường tại thời gian xây dựng
ARG VITE_API_URL
ARG VITE_SIGNALR_URL
ARG VITE_AUTH_URL
ARG VITE_CALLBACK_URL
ARG VITE_OAUTH_CLIENT_ID
ARG VITE_PAYPAL_CLIENT_ID
# Thiết lập các biến môi trường cho Vite
ENV VITE_API_URL=$VITE_API_URL \
    VITE_SIGNALR_URL=$VITE_SIGNALR_URL \
    VITE_AUTH_URL=$VITE_AUTH_URL \
    VITE_CALLBACK_URL=$VITE_CALLBACK_URL \
    VITE_OAUTH_CLIENT_ID=$VITE_OAUTH_CLIENT_ID \
    VITE_PAYPAL_CLIENT_ID=$VITE_PAYPAL_CLIENT_ID

ENV NODE_OPTIONS=--max-old-space-size=4096
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]