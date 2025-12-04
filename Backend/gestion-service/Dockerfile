FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at gestion-service/target/*.jar. Build locally if missing:
#   mvn -q -f gestion-service/pom.xml clean package -DskipTests
COPY gestion-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
