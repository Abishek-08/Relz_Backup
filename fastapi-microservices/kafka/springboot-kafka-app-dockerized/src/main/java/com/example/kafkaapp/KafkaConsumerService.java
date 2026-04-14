package com.example.kafkaapp;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "fastapi-topic", groupId = "spring-consumer-group")
    public void listen(String message) {
        System.out.println("🔔 Spring Boot received: " + message);
    }
}
