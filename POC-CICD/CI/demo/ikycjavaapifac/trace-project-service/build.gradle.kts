
plugins {
    java
    id("org.springframework.boot") version "3.4.5"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.sonarqube") version "5.1.0.4882"
}
group = "com.example"
version = "0.0.1-SNAPSHOT"
description = "Trace Project Service"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}
sonarqube {
        properties {
        property("sonar.projectKey", "trace-project-service")
        property("sonar.host.url", "http://localhost:9000")
        property("sonar.login", "sqp_cc96d235b2c5f66c97787119e6c131ce23970f99")
        property("sonar.gradle.skipCompile", "true")
        }
    }
repositories {
    mavenCentral()
}
extra["springCloudVersion"] = "2024.0.0"
dependencies {
    // --- Spring starters ---
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
    implementation("org.springframework.cloud:spring-cloud-starter-openfeign")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // *** Required for @Retry AOP proxying ***
    implementation("org.springframework.boot:spring-boot-starter-aop")

    // *** Resilience4j for Spring Boot 3 (annotation & auto-config) ***
    implementation("io.github.resilience4j:resilience4j-spring-boot3:2.2.0")
    // Optional: core retry module (handy for programmatic usage/testing)
    implementation("io.github.resilience4j:resilience4j-retry:2.2.0")

    // Lombok (optional but you used @Slf4j)
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // Dev & Test
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    testImplementation("org.springframework.boot:spring-boot-starter-test")

    // OpenTelemetry (your observability stack)
    implementation("io.opentelemetry:opentelemetry-api:1.31.0")
    implementation("io.opentelemetry:opentelemetry-sdk:1.31.0")

    // OpenAPI UI
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.14")
    implementation("io.micrometer:micrometer-registry-prometheus")
}
dependencyManagement {
    imports {
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
    }
}
tasks.withType<Test> {
    useJUnitPlatform()
}
