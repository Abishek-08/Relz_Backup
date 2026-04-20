package com.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@CrossOrigin("*")
@RequestMapping("/test")
public class ArgoDemoAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArgoDemoAppApplication.class, args);
	}
	
	@GetMapping("/argocd")
	public String testMethod() {
		return "Spring boot application is running successfully";
	}

}
