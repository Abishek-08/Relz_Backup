package com.trace.poc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients

public class TraceProjectServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TraceProjectServiceApplication.class, args);
	}

}
