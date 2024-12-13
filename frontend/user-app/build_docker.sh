#!/bin/bash

TAG="v1.66"

docker build \
    --build-arg VITE_API_URL="https://api.icoder.vn" \
    --build-arg VITE_SIGNALR_URL="https://api.icoder.vn/ai-service/ai-chat" \
    --build-arg VITE_AUTH_URL="https://accounts.icoder.vn" \
    --build-arg VITE_CALLBACK_URL="https://icoder.vn" \
    --build-arg VITE_OAUTH_CLIENT_ID="icoder.vn" \
    --build-arg VITE_PAYPAL_CLIENT_ID="ATncYgnc0VHRxHwgBByz3OLk3Nuw4SG4KXA3sLJZkwmYVxTxXFoxlEBt-UoBmZ-U0xKTY0dBZ18li-GA" \
    -t hub.icoder.vn/k8s/user-frontend:${TAG} .

docker push hub.icoder.vn/k8s/user-frontend:${TAG}
