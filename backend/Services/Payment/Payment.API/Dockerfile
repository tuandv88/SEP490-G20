#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Services/Payment/Payment.API/Payment.API.csproj", "Services/Payment/Payment.API/"]
COPY ["Services/Payment/Payment.Application/Payment.Application.csproj", "Services/Payment/Payment.Application/"]
COPY ["Services/Payment/Payment.Infrastructure/Payment.Infrastructure.csproj", "Services/Payment/Payment.Infrastructure/"]
COPY ["Services/Payment/Payment.Domain/Payment.Domain.csproj", "Services/Payment/Payment.Domain/"]

#utils
COPY ["BuildingBlocks/BuidingBlocks.Storage/BuidingBlocks.Storage.csproj", "BuildingBlocks/BuidingBlocks.Storage/"]
COPY ["BuildingBlocks/BuildingBlocks/BuildingBlocks.csproj", "BuildingBlocks/BuildingBlocks/"]
COPY ["BuildingBlocks/BuildingBlocks.Email/BuildingBlocks.Email.csproj", "BuildingBlocks/BuildingBlocks.Email/"]
COPY ["BuildingBlocks/BuildingBlocks.Messaging/BuildingBlocks.Messaging.csproj", "BuildingBlocks/BuildingBlocks.Messaging/"]

RUN dotnet restore "./Services/Payment/Payment.API/./Payment.API.csproj"
COPY . .
WORKDIR "/src/Services/Payment/Payment.API"
RUN dotnet build "./Payment.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Payment.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Payment.API.dll"]