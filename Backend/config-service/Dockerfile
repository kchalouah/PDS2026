FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at config-service/target/*.jar. Build locally if missing:
#   mvn -q -f config-service/pom.xml clean package -DskipTests
COPY config-service/target/*.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]
