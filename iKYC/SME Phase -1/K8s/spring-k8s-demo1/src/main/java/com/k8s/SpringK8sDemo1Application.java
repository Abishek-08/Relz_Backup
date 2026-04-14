package com.k8s;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@RequestMapping("test")
public class SpringK8sDemo1Application {

	public static void main(String[] args) {
		SpringApplication.run(SpringK8sDemo1Application.class, args);
	}
	
	@GetMapping("/deploy")
	public String testDeployment() {
		return "SpringBoot application is deployed successfully";
	}

}
