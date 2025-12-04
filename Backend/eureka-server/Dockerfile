FROM eclipse-temurin:17-jdk
WORKDIR /app
# Expect a prebuilt jar at eureka-server/target/*.jar. Build locally if missing:
#   mvn -q -f eureka-server/pom.xml clean package -DskipTests
COPY eureka-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
