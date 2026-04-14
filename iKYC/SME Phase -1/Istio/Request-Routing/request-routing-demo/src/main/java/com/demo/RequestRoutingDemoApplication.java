package com.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@RequestMapping("/test")
public class RequestRoutingDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(RequestRoutingDemoApplication.class, args);
	}
	
	@GetMapping("/app")
	public String getResponse() {
		return "The Application is running in the Version-2 (V2)";
	}

}
