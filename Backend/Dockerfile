# ---- ETAPE 1 : Build Maven ----
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copier tout le projet
COPY . .

# Rendre mvnw exécutable (IMPORTANT)
RUN chmod +x mvnw

# Build sans les tests
RUN ./mvnw clean package -DskipTests


# ---- ETAPE 2 : Runtime ----
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
