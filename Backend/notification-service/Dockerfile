FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at notification-service/target/*.jar. Build locally if missing:
#   mvn -q -f notification-service/pom.xml clean package -DskipTests
COPY notification-service/target/*.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java", "-jar", "app.jar"]
