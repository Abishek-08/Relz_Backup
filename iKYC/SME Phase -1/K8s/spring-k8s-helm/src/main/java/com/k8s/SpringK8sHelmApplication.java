package com.k8s;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@RequestMapping("/test")
public class SpringK8sHelmApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringK8sHelmApplication.class, args);
	}

	@GetMapping("/helm")
	public String testMethod() {
		return "Springboot application is successfully deployed on k8s-cluster through Helm for production (v3)";

	}

}
