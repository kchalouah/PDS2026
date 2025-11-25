# Étape 1 : build du JAR
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app

# Copier pom.xml et mvnw
COPY pom.xml mvnw ./

# Donner la permission d'exécution à mvnw
RUN chmod +x mvnw

# Copier tout le code
COPY . .

# Build
RUN ./mvnw clean package -DskipTests

# Étape 2 : image runtime
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
