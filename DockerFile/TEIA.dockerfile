# FRONTEND
FROM node:20 AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# BACKEND
FROM eclipse-temurin:17

WORKDIR /app

COPY sitebackend ./sitebackend

WORKDIR /app/sitebackend

RUN chmod +x mvnw || true

RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

RUN mv target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]