FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at patient-service/target/*.jar. Build locally if missing:
#   mvn -q -f patient-service/pom.xml clean package -DskipTests
COPY patient-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
