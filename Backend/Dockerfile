FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app

# Copier mvnw et pom.xml
COPY pom.xml mvnw ./

# Copier le reste du code
COPY . .

# Assurer l'exécution
RUN chmod +x mvnw && ./mvnw clean package -DskipTests
