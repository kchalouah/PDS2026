FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at prediction-service/target/*.jar. Build locally if missing:
#   mvn -q -f prediction-service/pom.xml clean package -DskipTests
COPY prediction-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
