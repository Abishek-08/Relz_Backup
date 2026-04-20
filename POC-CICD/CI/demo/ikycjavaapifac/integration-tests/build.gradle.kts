
plugins {
    id("java")
}

group = "com.mycompany"
version = "1.0.0"
java {

    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

repositories { mavenCentral() }
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testImplementation("io.rest-assured:rest-assured:5.3.0")
}
tasks.test {
    useJUnitPlatform()
    // Allow overriding service hosts via -Dsystem properties
    systemProperty("user.service.url", System.getProperty("user.service.url", "http://user-service.default.svc.cluster.local"))
    systemProperty("order.service.url", System.getProperty("order.service.url", "http://order-service.default.svc.cluster.local"))
    systemProperty("payment.service.url", System.getProperty("payment.service.url", "http://payment-service.default.svc.cluster.local"))
}
