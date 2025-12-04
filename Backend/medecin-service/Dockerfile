FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at medecin-service/target/*.jar. Build locally if missing:
#   mvn -q -f medecin-service/pom.xml clean package -DskipTests
COPY medecin-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
