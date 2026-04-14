package com.example.kafkaapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kafka")
public class KafkaController {

    @Autowired
    private KafkaProducerService producerService;

    @PostMapping("/produce")
    public String sendKafkaMessage(@RequestBody String message) {
        producerService.sendMessage(message);
        return "✅ Message sent to Kafka";
    }
}
