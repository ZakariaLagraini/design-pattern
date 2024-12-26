FROM openjdk:17-jdk-slim
WORKDIR /app
COPY app.jar app.jar

ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-catalog:5432/catalog_db
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres
ENV EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://service-registry:8761/eureka


EXPOSE 8082
RUN apt-get update && apt-get install -y netcat-traditional wget
ENTRYPOINT ["java", "-jar", "app.jar"]