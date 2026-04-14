package com.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

	@KafkaListener(topics = "springboot-topic", groupId = "spring-consumer-group")
	public void listen(String message) {
		System.out.println("🔔 Spring Boot received: " + message);
	}
	

}
