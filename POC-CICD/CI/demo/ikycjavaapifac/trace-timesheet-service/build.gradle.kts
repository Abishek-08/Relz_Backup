plugins {
    java
    id("org.springframework.boot") version "3.4.5"
    id("io.spring.dependency-management") version "1.1.7"    
	id("org.sonarqube") version "5.1.0.4882"
}
group = "com.trace"
version = "0.0.1-SNAPSHOT"
description = "Trace Timesheet Service"

java {
    toolchain { languageVersion = JavaLanguageVersion.of(21) }
}

sonarqube {
        properties {
        property("sonar.projectKey", "trace-timesheet-service")
        property("sonar.host.url", "http://localhost:9000")
        property("sonar.login", "sqp_187008c6d6ad5af4e799fa761a8f1d4c0f0d9c38")
        property("sonar.gradle.skipCompile", "true")
        }
    }
    
repositories { mavenCentral() }

extra["springCloudVersion"] = "2024.0.0"

dependencies {
    // --- Web + Actuator ---
    implementation("org.springframework.boot:spring-boot-starter-web")       // MVC + Jackson
    implementation("org.springframework.boot:spring-boot-starter-actuator")  // /actuator endpoints

    // --- AOP (REQUIRED for Resilience4j annotations to be woven) ---
    implementation("org.springframework.boot:spring-boot-starter-aop")

    // --- Data (MongoDB) ---
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb")

    // --- Cloud: Feign +  LoadBalancer ---
    implementation("org.springframework.cloud:spring-cloud-starter-openfeign")
    implementation("org.springframework.cloud:spring-cloud-starter-loadbalancer") // serviceId resolution for Feign

    // --- Resilience4j (Retry, CircuitBreaker, etc.) ---
    implementation("io.github.resilience4j:resilience4j-spring-boot3:2.2.0")

    // --- Observability / Metrics ---
    implementation("io.micrometer:micrometer-registry-prometheus")

    // --- Lombok ---
    compileOnly("org.projectlombok:lombok:1.18.42")
    annotationProcessor("org.projectlombok:lombok:1.18.42")
     compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    

    // --- Devtools (optional) ---
    developmentOnly("org.springframework.boot:spring-boot-devtools")

    // --- Testing ---
    testImplementation("org.springframework.boot:spring-boot-starter-test")

    // --- OpenTelemetry & API docs (optional, if you use them) ---
    implementation("io.opentelemetry:opentelemetry-api:1.31.0")
    implementation("io.opentelemetry:opentelemetry-sdk:1.31.0")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.14")
    implementation("io.micrometer:micrometer-registry-prometheus")
    
}
dependencyManagement {
    imports {
        // Spring Cloud BOM compatible with Spring Boot 3.4.x
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
    }
}
tasks.withType<Test> {
    useJUnitPlatform()
}
