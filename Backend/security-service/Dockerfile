FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at security-service/target/*.jar. Build locally if missing:
#   mvn -q -f security-service/pom.xml clean package -DskipTests
COPY security-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
