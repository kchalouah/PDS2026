FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at gateway-service/target/*.jar. Build locally if missing:
#   mvn -q -f gateway-service/pom.xml clean package -DskipTests
COPY gateway-service/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
