#!/bin/bash

# Build and Push Docker Images

TAG="v1.65"

declare -A images=(
    ["Services/AI/AI.API/Dockerfile"]="hub.icoder.vn/k8s/ai-service:${TAG}"
    ["Services/Community/Community.API/Dockerfile"]="hub.icoder.vn/k8s/community-service:${TAG}"
    ["Services/Identity/AuthServer/Dockerfile"]="hub.icoder.vn/k8s/auth-server:${TAG}"
    ["Services/Learning/Learning.API/Dockerfile"]="hub.icoder.vn/k8s/learning-service:${TAG}"
    ["Services/User/User.API/Dockerfile"]="hub.icoder.vn/k8s/user-service:${TAG}"
    ["Services/Payment/Payment.API/Dockerfile"]="hub.icoder.vn/k8s/payment-service:${TAG}"
    ["ApiGateways/YarpApiGateway/Dockerfile"]="hub.icoder.vn/k8s/api-gateway:${TAG}"
)

for path in "${!images[@]}"; do
    tag=${images[$path]}
    echo "Building image: $tag from Dockerfile: $path"
    docker build -f "$path" -t "$tag" .
    
    if [ $? -eq 0 ]; then
        echo "Successfully built $tag. Pushing to registry..."
        docker push "$tag"
        
        if [ $? -eq 0 ]; then
            echo "Successfully pushed $tag."
        else
            echo "Failed to push $tag." >&2
        fi
    else
        echo "Failed to build $tag." >&2
    fi
    
    echo "----------------------------------------"
done

echo "Build and push process completed." 