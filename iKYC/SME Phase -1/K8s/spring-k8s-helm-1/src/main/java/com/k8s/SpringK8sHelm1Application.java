package com.k8s;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@RequestMapping("/verify")
public class SpringK8sHelm1Application {

	public static void main(String[] args) {
		SpringApplication.run(SpringK8sHelm1Application.class, args);
	}
	
	@GetMapping("/deploy")
	public String testMethod() {
		return "spring boot is successfully deployed on k8s-cluster through HELM charts";
	}

}
