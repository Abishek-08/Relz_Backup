package com.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@RequestMapping("/test")
public class OxSampleDeployApplication {

	public static void main(String[] args) {
		SpringApplication.run(OxSampleDeployApplication.class, args);
	}
	
	@GetMapping("/app")
	public String test() {
		return "Application is successfully deployed on the NGINX server";
	}

}
