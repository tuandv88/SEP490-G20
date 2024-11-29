#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 80
EXPOSE 81

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Services/Learning/Learning.API/Learning.API.csproj", "Services/Learning/Learning.API/"]
COPY ["Services/Learning/Learning.Application/Learning.Application.csproj", "Services/Learning/Learning.Application/"]
COPY ["Services/Learning/Learning.Infrastructure/Learning.Infrastructure.csproj", "Services/Learning/Learning.Infrastructure/"]
COPY ["Services/Learning/Learning.Domain/Learning.Domain.csproj", "Services/Learning/Learning.Domain/"]

#utils
COPY ["BuildingBlocks/BuidingBlocks.Storage/BuidingBlocks.Storage.csproj", "BuildingBlocks/BuidingBlocks.Storage/"]
COPY ["BuildingBlocks/BuildingBlocks/BuildingBlocks.csproj", "BuildingBlocks/BuildingBlocks/"]
COPY ["BuildingBlocks/BuildingBlocks.Email/BuildingBlocks.Email.csproj", "BuildingBlocks/BuildingBlocks.Email/"]
COPY ["BuildingBlocks/BuildingBlocks.Messaging/BuildingBlocks.Messaging.csproj", "BuildingBlocks/BuildingBlocks.Messaging/"]

RUN dotnet restore "./Services/Learning/Learning.API/./Learning.API.csproj"
COPY . .
WORKDIR "/src/Services/Learning/Learning.API"
RUN dotnet build "./Learning.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Learning.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Learning.API.dll"]