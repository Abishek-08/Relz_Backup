package com.k8s;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.k8s.job.ReportGenerationScheduler;

@SpringBootApplication
@EnableScheduling
public class SpringK8sCronjobApplication implements CommandLineRunner {

	@Autowired
	private ReportGenerationScheduler reportGenerationScheduler;

	public static void main(String[] args) {
		SpringApplication.run(SpringK8sCronjobApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		reportGenerationScheduler.generateReportAndSendEmail();

	}

}
