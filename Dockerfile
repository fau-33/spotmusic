# Passo 1: Baixa o Java e o Maven para compilar o código
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Passo 2: Pega só o arquivo .jar pronto e roda no servidor
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar spotmusic.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "spotmusic.jar"]