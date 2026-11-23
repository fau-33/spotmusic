FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY spotmusic .
RUN mvn clean package -DskipTests


FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar spotmusic.jar
EXPOSE 10000
ENTRYPOINT ["java", "-Xms128m", "-Xmx256m", "-XX:MaxMetaspaceSize=128m", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-jar", "spotmusic.jar"]