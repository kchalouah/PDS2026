FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at supervision-service/target/*.jar. Build locally if missing:
#   mvn -q -f supervision-service/pom.xml clean package -DskipTests
COPY supervision-service/target/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
