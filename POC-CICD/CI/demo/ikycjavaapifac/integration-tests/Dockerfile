
# Gradle 8 with JDK 21
FROM gradle:8-jdk21

WORKDIR /tests
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src ./src

# Run tests at build (optional)
CMD ["gradle", "test", "--no-daemon"]

# Default command: run tests on container start
