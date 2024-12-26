# Use a base image with Java 17
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Set environment variables
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-user:5432/user_db
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres
ENV EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://service-registry:8761/eureka

# Expose the port the app runs on
EXPOSE 8081

RUN apt-get update && apt-get install -y netcat-traditional wget

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]