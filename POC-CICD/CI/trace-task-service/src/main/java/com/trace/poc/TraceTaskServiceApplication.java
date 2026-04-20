package com.trace.poc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class TraceTaskServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TraceTaskServiceApplication.class, args);
	}

}
