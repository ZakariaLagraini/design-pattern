FROM openjdk:17-jdk-slim
WORKDIR /app
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8082
RUN apt-get update && apt-get install -y netcat-traditional wget
ENTRYPOINT ["java", "-jar", "app.jar"]