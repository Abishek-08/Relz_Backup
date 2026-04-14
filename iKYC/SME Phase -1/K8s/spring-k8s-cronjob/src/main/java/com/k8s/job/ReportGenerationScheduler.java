package com.k8s.job;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.k8s.service.NotificationService;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ReportGenerationScheduler {

	@Autowired
	private NotificationService notificationService;

	public void generateReportAndSendEmail() {
		log.info("ReportGenerationScheduler::generateReportAndSendEmail Execution started on {} ",
				new java.util.Date());
		try {

			// send email
			notificationService.sendDailyReports();
			log.info("ReportGenerationScheduler::generateReportAndSendEmail Execution ended on {} ",
					new java.util.Date());

		} catch (IOException | MessagingException e) {
			log.error("ReportGenerationScheduler::generateReportAndSendEmail Exception occurred {} ", e.getMessage());
			e.printStackTrace();
		}
	}

}
