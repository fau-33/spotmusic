# Passo 1: Baixa o Java e o Maven para compilar o código
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Passo 2: Pega só o arquivo .jar pronto e roda no servidor
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar spotmusic.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "spotmusic.jar"]