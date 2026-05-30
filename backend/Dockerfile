FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy only the pom first to leverage Docker cache for dependencies
# We use the official maven image so the mvnw wrapper is not required.
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

# Copy the source and build
COPY src ./src
RUN mvn -B -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the jar produced by Maven
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
