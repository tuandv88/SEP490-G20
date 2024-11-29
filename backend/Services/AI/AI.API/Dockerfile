#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 80
EXPOSE 81

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Services/AI/AI.API/AI.API.csproj", "Services/AI/AI.API/"]
COPY ["Services/AI/AI.Application/AI.Application.csproj", "Services/AI/AI.Application/"]
COPY ["Services/AI/AI.Infrastructure/AI.Infrastructure.csproj", "Services/AI/AI.Infrastructure/"]
COPY ["Services/AI/AI.Domain/AI.Domain.csproj", "Services/AI/AI.Domain/"]

#utils
COPY ["BuildingBlocks/BuidingBlocks.Storage/BuidingBlocks.Storage.csproj", "BuildingBlocks/BuidingBlocks.Storage/"]
COPY ["BuildingBlocks/BuildingBlocks/BuildingBlocks.csproj", "BuildingBlocks/BuildingBlocks/"]
COPY ["BuildingBlocks/BuildingBlocks.Email/BuildingBlocks.Email.csproj", "BuildingBlocks/BuildingBlocks.Email/"]
COPY ["BuildingBlocks/BuildingBlocks.Messaging/BuildingBlocks.Messaging.csproj", "BuildingBlocks/BuildingBlocks.Messaging/"]


RUN dotnet restore "./Services/AI/AI.API/./AI.API.csproj"
COPY . .
WORKDIR "/src/Services/AI/AI.API"
RUN dotnet build "./AI.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AI.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AI.API.dll"]