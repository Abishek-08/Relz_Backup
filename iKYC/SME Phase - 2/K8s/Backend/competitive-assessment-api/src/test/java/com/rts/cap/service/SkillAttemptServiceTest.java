//package com.rts.cap.service;
// 
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNotNull; 
//import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
//import org.junit.jupiter.api.Order;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.TestMethodOrder;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
// 
// 
///**
//* @author prem.mariyappan, @author vinolisha.v, 
//*/
//import com.rts.cap.service.impl.SkillAttemptServiceImpl;
// 
//@SpringBootTest
//@TestMethodOrder(OrderAnnotation.class)
//class SkillAttemptServiceTest {
// 
//	@Autowired
//    private SkillAttemptServiceImpl skillAttemptService;
// 
//    @Test
//    @Order(1)
//    public void testgetCodingQuestions1() {
//        int userId = 1;
//        int schedulingId = 1;
//        assertNotNull(skillAttemptService.getCodingQuestions(userId, schedulingId));   
//    }
//    
//    @Test
//    @Order(2)
//    public void testgetCodingQuestions2() {
//        int userId = 1;
//        int schedulingId = 1;
//        assertEquals(true, skillAttemptService.getCodingQuestions(userId, schedulingId).size()>0);   
//    }
//}
// 
// 