#!/bin/bash

docker build \
    --build-arg VITE_API_URL="https://api.icoder.vn" \
    --build-arg VITE_SIGNALR_URL="https://api.icoder.vn/ai-service/ai-chat" \
    --build-arg VITE_AUTH_URL="https://accounts.icoder.vn" \
    --build-arg VITE_CALLBACK_URL="https://icoder.vn" \
    --build-arg VITE_OAUTH_CLIENT_ID="icoder.vn" \
    -t hub.icoder.vn/k8s/user-frontend:v1.62 .