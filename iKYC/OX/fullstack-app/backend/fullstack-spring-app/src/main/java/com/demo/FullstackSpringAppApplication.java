package com.demo;

import java.util.ArrayList;
import java.util.List;

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
public class FullstackSpringAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(FullstackSpringAppApplication.class, args);
	}

	@GetMapping("/cars")
	public List<String> getAllCars() {
		ArrayList<String> carList = new ArrayList<String>();
		carList.add("BMW");
		carList.add("Benz");
		carList.add("Toyota");
		carList.add("RR");

		return carList;
	}

}
