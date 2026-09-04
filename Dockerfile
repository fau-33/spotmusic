FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY spotmusic .
RUN mvn clean package -DskipTests


FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar spotmusic.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "spotmusic.jar"]