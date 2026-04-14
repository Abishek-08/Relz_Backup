package com.k8s.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationService {

	@Autowired
	private JavaMailSender javaMailSender;

	@Value("${spring.mail.username}")
	private String sender;

	@Value("${report.send.email.toList}")
	private String toEMails;

	public String sendDailyReports() throws MessagingException, IOException {

		MimeMessage mimeMessage = javaMailSender.createMimeMessage();

		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

		helper.setFrom(sender);
		helper.setTo(toEMails.split(","));
		helper.setSubject("Daily User OnBoarding Report - " + new java.util.Date());
		helper.setText("Hi Team\nPlease find the attached document containing today's list of newly onboarded users !");


		javaMailSender.send(mimeMessage);
		return "Mail sent successfully with attachment ";
	}

}
