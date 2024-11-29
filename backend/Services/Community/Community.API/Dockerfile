#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 80
EXPOSE 81

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Services/Community/Community.API/Community.API.csproj", "Services/Community/Community.API/"]
COPY ["Services/Community/Community.Application/Community.Application.csproj", "Services/Community/Community.Application/"]
COPY ["Services/Community/Community.Domain/Community.Domain.csproj", "Services/Community/Community.Domain/"]
COPY ["Services/Community/Community.Infrastructure/Community.Infrastructure.csproj", "Services/Community/Community.Infrastructure/"]

#utils
COPY ["BuildingBlocks/BuidingBlocks.Storage/BuidingBlocks.Storage.csproj", "BuildingBlocks/BuidingBlocks.Storage/"]
COPY ["BuildingBlocks/BuildingBlocks/BuildingBlocks.csproj", "BuildingBlocks/BuildingBlocks/"]
COPY ["BuildingBlocks/BuildingBlocks.Email/BuildingBlocks.Email.csproj", "BuildingBlocks/BuildingBlocks.Email/"]
COPY ["BuildingBlocks/BuildingBlocks.Messaging/BuildingBlocks.Messaging.csproj", "BuildingBlocks/BuildingBlocks.Messaging/"]

RUN dotnet restore "./Services/Community/Community.API/./Community.API.csproj"
COPY . .
WORKDIR "/src/Services/Community/Community.API"
RUN dotnet build "./Community.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Community.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Community.API.dll"]