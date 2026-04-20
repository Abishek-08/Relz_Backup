
# Java Integration Tests (RestAssured + JUnit 5)

Java-only test sources with Gradle **Kotlin DSL** build.

## Structure
- `build.gradle.kts` — Gradle Kotlin DSL (Java plugin, JUnit 5, RestAssured)
- `settings.gradle.kts` — project name
- `src/test/java/com/mycompany/tests/EndToEndIT.java` — end-to-end flow test
- `Dockerfile` — containerized test runner

## Run locally
```bash
./gradlew test \
  -Duser.service.url=http://user-service.default.svc.cluster.local \
  -Dorder.service.url=http://order-service.default.svc.cluster.local \
  -Dpayment.service.url=http://payment-service.default.svc.cluster.local
```

## Run in Docker
```bash
docker build -t java-restassured-it:latest .
docker run --rm \
  -e GRADLE_OPTS="-Duser.service.url=http://user-service.default.svc.cluster.local -Dorder.service.url=http://order-service.default.svc.cluster.local -Dpayment.service.url=http://payment-service.default.svc.cluster.local" \
  java-restassured-it:latest
```

> Ensure the runner can resolve/reach `*.default.svc.cluster.local` (inside cluster network, VPN, or via port-forwarding).
