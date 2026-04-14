package com.rts.cap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CompetitiveAssessmentApiApplication {

	private static final Logger LOGGER = LogManager.getLogger(CompetitiveAssessmentApiApplication.class);
	
	public static void main(String[] args) {
		
		SpringApplication.run(CompetitiveAssessmentApiApplication.class, args);
		LOGGER.info("Running inside main methods");
	}

}
