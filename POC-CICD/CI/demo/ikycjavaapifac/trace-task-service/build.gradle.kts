plugins {
	java
	id("org.springframework.boot") version "3.4.5"
	id("io.spring.dependency-management") version "1.1.7"
	id("org.sonarqube") version "5.1.0.4882"
}

group = "com.trace"
version = "0.0.1-SNAPSHOT"
description = "Demo project for Spring Boot"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}
sonarqube {
        properties {
        property("sonar.projectKey", "trace-task-service")
        property("sonar.host.url", "http://localhost:9000")
        property("sonar.login", "sqp_9f50302beb96586e9e0ea2722d73c53050258d71")
        property("sonar.gradle.skipCompile", "true")
        }
    }
    
repositories {
	mavenCentral()
}
extra["springCloudVersion"] = "2024.0.0"

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
	//implementation("org.springframework.boot:spring-boot-starter-opentelemetry")
	implementation("org.springframework.boot:spring-boot-starter-web")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	// https://mvnrepository.com/artifact/org.projectlombok/lombok
    implementation("org.projectlombok:lombok:1.18.42")
     compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.14")
    
    // Feign (OpenFeign)
    implementation("org.springframework.cloud:spring-cloud-starter-openfeign")

    // Actuator (modern endpoints)
    implementation("org.springframework.boot:spring-boot-starter-actuator")
      // Devtools (optional)
    developmentOnly("org.springframework.boot:spring-boot-devtools")

    // Tests
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    
    //open telemetry
    implementation("io.opentelemetry:opentelemetry-api:1.31.0")
    implementation("io.opentelemetry:opentelemetry-sdk:1.31.0")
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
