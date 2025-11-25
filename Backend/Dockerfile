# Étape 1 : build du JAR
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml mvnw ./
COPY . .
RUN ./mvnw clean package -DskipTests

# Étape 2 : image runtime
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
