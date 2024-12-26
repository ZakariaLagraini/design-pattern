FROM openjdk:17-jdk-slim
WORKDIR /app
COPY app.jar app.jar
EXPOSE 8080
RUN apt-get update && apt-get install -y netcat-traditional wget
ENTRYPOINT ["java", "-jar", "app.jar"]