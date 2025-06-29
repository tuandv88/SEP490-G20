#!/bin/bash

TAG="v1.68"

docker build \
    --build-arg VITE_BASE_URL="https://api.icoder.vn" \
    --build-arg VITE_BASE_URL_AUTH="https://accounts.icoder.vn" \
    --build-arg VITE_BASE_URL_CALLBACK="https://admin.icoder.vn" \
    --build-arg VITE_APP_TITLE="ICODER" \
    --build-arg VITE_OAUTH_CLIENT_ID="admin.icoder.vn" \
    -t hub.icoder.vn/k8s/admin-frontend:${TAG} .

docker push hub.icoder.vn/k8s/admin-frontend:${TAG}
