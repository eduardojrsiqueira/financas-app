# syntax=docker/dockerfile:1

# ---- Frontend build ----
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npx ng build --configuration production

# ---- Backend build ----
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /backend
COPY backend/pom.xml ./
RUN mvn -B dependency:go-offline
COPY backend/src ./src
COPY --from=frontend-build /frontend/dist/frontend/ ./src/main/resources/static/
RUN mvn -B clean package -DskipTests

# ---- Runtime ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /backend/target/financas-app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
