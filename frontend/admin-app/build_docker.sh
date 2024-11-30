#!/bin/bash

docker build \
    --build-arg VITE_BASE_URL="https://api.icoder.vn" \
    --build-arg VITE_BASE_URL_AUTH="https://accounts.icoder.vn" \
    --build-arg VITE_BASE_URL_CALLBACK="https://admin.icoder.vn" \
    --build-arg VITE_APP_TITLE="ICODER" \
    -t hub.icoder.vn/k8s/admin-frontend:v1.51 .