# Build and Push Docker Images

# Array of Dockerfiles and their corresponding image tags
$images = @(
    @{ Path = "Services/AI/AI.API/Dockerfile"; Tag = "hub.icoder.vn/k8s/ai-service:v1.54" },
    @{ Path = "Services/Community/Community.API/Dockerfile"; Tag = "hub.icoder.vn/k8s/community-service:v1.54" },
    @{ Path = "Services/Identity/AuthServer/Dockerfile"; Tag = "hub.icoder.vn/k8s/auth-server:v1.54" },
    @{ Path = "Services/Learning/Learning.API/Dockerfile"; Tag = "hub.icoder.vn/k8s/learning-service:v1.54" },
    @{ Path = "Services/User/User.API/Dockerfile"; Tag = "hub.icoder.vn/k8s/user-service:v1.54" },
    @{ Path = "ApiGateways/YarpApiGateway/Dockerfile"; Tag = "hub.icoder.vn/k8s/api-gateway:v1.54" }
)

foreach ($image in $images) {
    Write-Host "Building image: $($image.Tag) from Dockerfile: $($image.Path)"
    docker build -f $image.Path -t $image.Tag .

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully built $($image.Tag). Pushing to registry..."
        docker push $image.Tag

        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully pushed $($image.Tag)."
        } else {
            Write-Host "Failed to push $($image.Tag)." -ForegroundColor Red
        }
    } else {
        Write-Host "Failed to build $($image.Tag)." -ForegroundColor Red
    }

    Write-Host "----------------------------------------`n"
}

Write-Host "Build and push process completed."