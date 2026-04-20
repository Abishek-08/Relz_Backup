
// src/main/java/com/trace/poc/TraceTimesheetServiceApplication.java
package com.trace.poc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.trace.poc.client")
public class TraceTimesheetServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(TraceTimesheetServiceApplication.class, args);
	}
}
