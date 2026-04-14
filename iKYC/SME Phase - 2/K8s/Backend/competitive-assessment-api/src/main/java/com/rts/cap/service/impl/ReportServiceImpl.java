package com.rts.cap.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LearningAssessmentDao;
import com.rts.cap.dao.ReportDao;
import com.rts.cap.dao.SkillAssessmentDao;
import com.rts.cap.dto.BatchOverallReportDto;
import com.rts.cap.dto.BatchReportGenerationDto;
import com.rts.cap.dto.BatchSkillReportDto;
import com.rts.cap.dto.BatchUsersReportGenerationDto;
import com.rts.cap.dto.GetAllAssessmentDto;
import com.rts.cap.dto.IndividualUserReportDto;
import com.rts.cap.dto.KnowledgeAssessmentCountsDto;
import com.rts.cap.dto.ScheduleAssessmentTypeDto;
import com.rts.cap.dto.UnMappedUserReportDto;
import com.rts.cap.model.LearningAssessment;
import com.rts.cap.model.SkillAssessment;
import com.rts.cap.service.ReportService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ReportServiceImpl implements ReportService {

	private ReportDao reportDao;
	private LearningAssessmentDao learningAssessmentDao;
	private SkillAssessmentDao skillAssessmentDao;

	public ReportServiceImpl(ReportDao reportDao, LearningAssessmentDao learningAssessmentDao,
			SkillAssessmentDao skillAssessmentDao) {
		super();
		this.reportDao = reportDao;
		this.learningAssessmentDao = learningAssessmentDao;
		this.skillAssessmentDao = skillAssessmentDao;
	}

	@Override
	public List<IndividualUserReportDto> getIndividualUserReport(int schedulingId, String type) {
		if (type.equalsIgnoreCase("skill"))
			return getIndividualUserSkillReport(schedulingId);
		return getIndividualUserKnowledgeReport(schedulingId);
	}

	private List<IndividualUserReportDto> getIndividualUserSkillReport(int schedulingId) {
		List<Object[]> tempList = reportDao.getIndividualUserSkillReport(schedulingId);
		List<IndividualUserReportDto> individualUserSkillReportDtoList = new ArrayList<>();
		for (Object[] result : tempList) {
			IndividualUserReportDto individualUserSkillReportDto = new IndividualUserReportDto((Integer) result[0],
					(String) result[1], (String) result[2], (Double) result[3], (String) result[4], (String) result[5],
					(String) result[6], (Integer) result[7], (Integer) result[8]);
			individualUserSkillReportDtoList.add(individualUserSkillReportDto);
		}
		return individualUserSkillReportDtoList;
	}

	private List<IndividualUserReportDto> getIndividualUserKnowledgeReport(int schedulingId) {
		List<Object[]> tempList = reportDao.getIndividualUserKnowledgeReport(schedulingId);
		List<IndividualUserReportDto> individualUserReportList = new ArrayList<>();
		for (Object[] result : tempList) {
			IndividualUserReportDto individualUserReportDto = new IndividualUserReportDto((Integer) result[0],
					(String) result[1], (String) result[2], (Double) result[3], (String) result[4], (String) result[5],
					(String) result[6], (Integer) result[7], 0);
			individualUserReportList.add(individualUserReportDto);
		}
		return individualUserReportList;
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 06-08-2024 Calculates the overall percentages for unmapped users.
	 *
	 *        This method retrieves the list of unmapped users, calculates the
	 *        overall skill percentage and overall learning percentage, and returns
	 *        a report DTO containing these percentages.
	 *
	 * @return a report DTO containing the overall skill percentage and overall
	 *         learning percentage for unmapped users
	 */
	@Override
	public UnMappedUserReportDto calculateOverallPercentagesForUnmappedUsers() {
		Object[] result = reportDao.findOverAllSkillKnowledgeScoreUnBatchedUsers();
		return new UnMappedUserReportDto((Double) result[0], (Double) result[1]);

	}

	@Override
	public List<BatchReportGenerationDto> getBatchReport(int batchId, String type) {
		if (type.equalsIgnoreCase("skill"))
			return getSkillAssessmentBatchReport(batchId);
		return getLearningAssessmentBatchReport(batchId);
	}

	/**
	 * This "getLearningAssessmentBatchReport" method is used to get all learning
	 * assessment details with overall percentages in the particular assessment.
	 * 
	 * @return batchReportList
	 */
	private List<BatchReportGenerationDto> getLearningAssessmentBatchReport(int batchId) {
		List<Object[]> tempDataList = reportDao.getLearningBatchReport(batchId);
		List<BatchReportGenerationDto> batchReportList = new ArrayList<>();
		tempDataList.forEach((result) -> {
			BatchReportGenerationDto batchReportGenerationDto = new BatchReportGenerationDto((Integer) result[2],
					(String) result[3], (Double) result[1]);
			batchReportList.add(batchReportGenerationDto);
		});
		return batchReportList;
	}

	/**
	 * This "getLearningAssessmentBatchUserReport" method is used to get list of
	 * users who had attempt in that particular learning assessment in batch.
	 * 
	 * @return batchUsersReportGenerationDtoList
	 */
	@Override
	public List<BatchUsersReportGenerationDto> getLearningAssessmentBatchUserReport(int batchId, int assessmentId) {
		List<Object[]> tempDataList = reportDao.getLearningBatchUserReport(batchId, assessmentId);
		List<BatchUsersReportGenerationDto> batchUsersReportGenerationDtoList = new ArrayList<>();
		tempDataList.forEach((result) -> {
			BatchUsersReportGenerationDto batchUsersReportGenerationDto = new BatchUsersReportGenerationDto(
					(Integer) result[0], (String) result[1], (String) result[2], (Double) result[3], (String) result[4],
					(String) result[5], (String) result[6], (String) result[7], (String) result[8], (String) result[9],
					(Integer) result[10], (Integer) result[11]);
			batchUsersReportGenerationDtoList.add(batchUsersReportGenerationDto);
		});
		return batchUsersReportGenerationDtoList;
	}

	/**
	 * This "getSkillAssessmentBatchReport" method is used to get all skill
	 * assessment details with overall percentage or mark in that assessment.
	 * 
	 * @return skillBatchReportDtoList
	 */
	private List<BatchReportGenerationDto> getSkillAssessmentBatchReport(int batchId) {
		List<Object[]> skillBatchReportList = reportDao.findSkillBatchReport(batchId);
		List<BatchReportGenerationDto> skillBatchReportDtoList = new ArrayList<>();
		skillBatchReportList.forEach((result) -> {
			BatchReportGenerationDto batchReportGenerationDto = new BatchReportGenerationDto((Integer) result[2],
					(String) result[4], (Double) result[3]);
			skillBatchReportDtoList.add(batchReportGenerationDto);
		});
		return skillBatchReportDtoList;
	}

	/**
	 * This "getSkillAssessmentBatchUsersReport" method is used to get user list who
	 * had attempt that skill assessment in the batch
	 * 
	 * @return batchUsersReportGenerationDtoList
	 */
	@Override
	public List<BatchSkillReportDto> getSkillAssessmentBatchUsersReport(int batchId, int assessmentId) {
		List<Object[]> tempDataList = reportDao.findSkillAssessmentBatchUsers(batchId, assessmentId);
		List<BatchSkillReportDto> batchUsersReportGenerationDtoList = new ArrayList<>();
		tempDataList.forEach((result) -> {
			BatchSkillReportDto batchSkillReportDto = new BatchSkillReportDto((Integer) result[0], (String) result[1],
					(String) result[2], (Double) result[3], (String) result[4], (String) result[5], (String) result[6],
					(String) result[7], (String) result[8], (Integer) result[9], (Integer) result[10],
					(Integer) result[11]);
			batchUsersReportGenerationDtoList.add(batchSkillReportDto);
		});
		return batchUsersReportGenerationDtoList;
	}

	@Override
	public List<BatchOverallReportDto> getOverallBatchReport(String type) {
		if (type.equalsIgnoreCase("skill"))
			return getSkillOverallBatchReport();
		return getLearningOverallBatchReport();
	}

	/**
	 * This "getLearningOverallBatchReport" method is used to get list of batch with
	 * overall mark or percentage for the learn assessment where the batch members
	 * were attempted.
	 * 
	 * @return batchOverallReportDtoList
	 */
	private List<BatchOverallReportDto> getLearningOverallBatchReport() {
		List<Object[]> tempDataList = reportDao.getOverallLearningBatchReport();
		List<BatchOverallReportDto> batchOverallReportDtoList = new ArrayList<>();
		tempDataList.forEach((result) -> {
			BatchOverallReportDto batchOverallReportDto = new BatchOverallReportDto((Integer) result[0],
					(String) result[1], (Double) result[2]);
			batchOverallReportDtoList.add(batchOverallReportDto);
		});
		return batchOverallReportDtoList;
	}

	/**
	 * This "getSkillOverallBatchReport" method is used to get list of batch with
	 * overall mark or percentage for the skill assessment where the batch members
	 * were attempted.
	 * 
	 * @return batchOverallReportDtoList
	 */
	private List<BatchOverallReportDto> getSkillOverallBatchReport() {
		List<Object[]> tempDataList = reportDao.findOverallSkillBatchReport();
		List<BatchOverallReportDto> batchOverallReportDtoList = new ArrayList<>();
		tempDataList.forEach((result) -> {
			BatchOverallReportDto batchOverallReportDto = new BatchOverallReportDto((Integer) result[0],
					(String) result[1], (Double) result[2]);
			batchOverallReportDtoList.add(batchOverallReportDto);
		});
		return batchOverallReportDtoList;
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 06-08-2024 Retrieves the scheduled learning assessment details.
	 * @return a KnowledgeAssessmentCountsDto object containing the counts of
	 *         different types of learning assessments
	 */
	@Override
	public KnowledgeAssessmentCountsDto getScheduledLearningAssessmentDetails() {
		Object[] tempObject = reportDao.findKnowledgeOverallAssessmentCount();
		return new KnowledgeAssessmentCountsDto((Long) tempObject[0], (Long) tempObject[1], (Long) tempObject[2],
				(Long) tempObject[3], (Long) tempObject[4]);
	}

	/**
	 * @author ranjitha.rajaram
	 * @version 6.0
	 * @since 06-08-2024 Retrieves the number of scheduled skill assessments.
	 * @return the number of scheduled skill assessments
	 */
	@Override
	public long getScheduledSkillAssessmentDetails() {
		return reportDao.findAllScheduledSkillAssessment();
	}

	/**
	 * Method for indicating what assessment it been scheduled whether skill or
	 * knowledge
	 */
	@Override
	public ScheduleAssessmentTypeDto findAssessmentTypeByAssessmentId(int assessmentId) {
		List<SkillAssessment> skillAssessmentList = skillAssessmentDao.findAllSkillAssessment();
		List<LearningAssessment> learningAssessmentList = learningAssessmentDao.getAllLearningAssessment();
		ScheduleAssessmentTypeDto scheduleAssessmentTypeDto = new ScheduleAssessmentTypeDto();
		skillAssessmentList.forEach(skill -> {
			if (skill.getAssessment().getAssessmentId() == assessmentId) {
				scheduleAssessmentTypeDto.setAssessmentName(MessageConstants.SKILL_ASSESSMENT_NAME);
				scheduleAssessmentTypeDto.setAssessmentType(MessageConstants.NOT_AVAILABLE);
			}
		});
		learningAssessmentList.forEach(learn -> {
			if (learn.getAssessment().getAssessmentId() == assessmentId) {
				scheduleAssessmentTypeDto.setAssessmentName(MessageConstants.KNOWLEDGE_ASSESSMENT_NAME);
				scheduleAssessmentTypeDto.setAssessmentType(learn.getType());
			}
		});
		return scheduleAssessmentTypeDto;
	}

	@Override
	public List<GetAllAssessmentDto> getAllAssessment(String type) {
		if (type.equalsIgnoreCase("skill"))
			return getAllSkillAssessment();
		return getAllKnowledgeAssessment();
	}

	private List<GetAllAssessmentDto> getAllSkillAssessment() {
		List<Object[]> tempList = reportDao.findAllSkillAssessment();
		List<GetAllAssessmentDto> allSkillAssessmentList = new ArrayList<>();
		tempList.forEach((result) -> {
			GetAllAssessmentDto getAllAssessmentDto = new GetAllAssessmentDto((Integer) result[0], (String) result[1]);
			allSkillAssessmentList.add(getAllAssessmentDto);
		});
		return allSkillAssessmentList;
	}

	private List<GetAllAssessmentDto> getAllKnowledgeAssessment() {
		List<Object[]> tempList = reportDao.findAllKnowledgeAssessment();
		List<GetAllAssessmentDto> allKnowledgeAssessmentList = new ArrayList<>();
		tempList.forEach((result) -> {
			GetAllAssessmentDto getAllAssessmentDto = new GetAllAssessmentDto((Integer) result[0], (String) result[1]);
			allKnowledgeAssessmentList.add(getAllAssessmentDto);
		});
		return allKnowledgeAssessmentList;
	}

}
