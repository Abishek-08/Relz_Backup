//package com.rts.cap.dao;
//
//import java.util.List;
//
//import com.rts.cap.exception.CapBusinessException;
//import com.rts.cap.model.Genuinity;
//
//public interface GenuinityDao {
//
//	Genuinity saveGenuinity(Genuinity genuinity);
//
//	Genuinity findGenuinityScoreByUserIdScheduledId(int schedulingId, long userId);
//	
//	List<Integer> getListofSchedulingIdFormLearningScorecard(long userId) throws CapBusinessException;
//	
//	double getAverageGenuinity(long schedulingId);
//	
//	List<Integer> getListofSchedulingIdFromSkillAttempt(long userId) throws CapBusinessException;
//	
//	double getOverAllAverageOfTheUser(long userId) throws CapBusinessException;
//}
