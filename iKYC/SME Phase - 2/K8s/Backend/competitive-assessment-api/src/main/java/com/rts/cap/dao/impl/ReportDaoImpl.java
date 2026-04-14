package com.rts.cap.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.dao.ReportDao;

import jakarta.persistence.EntityManager;

@Repository
public class ReportDaoImpl implements ReportDao {

	private EntityManager entityManager;

	public ReportDaoImpl(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> getIndividualUserSkillReport(int schedulingId) {
		return entityManager.createNativeQuery(
				"SELECT  DISTINCT skl.user_id,us.user_email,us.user_name,total_score,status,schl.assessment_date,ast.assessment_name,skl.scheduling_id,skl.attempt_id\r\n"
						+ "FROM skill_attempt_tbl skl\r\n" + "JOIN user_tbl us ON us.user_id = skl.user_id\r\n"
						+ "JOIN schedule_assessment_tbl schl ON schl.scheduling_id = skl.scheduling_id\r\n"
						+ "JOIN assessment ast ON ast.assessment_id=schl.assessment_id\r\n"
						+ "WHERE skl.scheduling_id=:schedulingId\r\n" + "AND skl.user_id\r\n"
						+ "NOT IN(SELECT user_user_id FROM batch_user)")
				.setParameter("schedulingId", schedulingId).getResultList();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> getIndividualUserKnowledgeReport(int schedulingId) {
		return entityManager.createNativeQuery(
				"SELECT lrn.user_id,us.user_email,us.user_name,score,status,schl.assessment_date,ast.assessment_name, lrn.schedule_assessment_id\r\n"
						+ "FROM learning_assessment_score_card_tbl lrn\r\n"
						+ "JOIN user_tbl us ON us.user_id = lrn.user_id\r\n"
						+ "JOIN schedule_assessment_tbl schl ON schl.scheduling_id = lrn.schedule_assessment_id\r\n"
						+ "JOIN assessment ast ON ast.assessment_id = schl.assessment_id\r\n"
						+ "WHERE schedule_assessment_id=:schedulingId\r\n" + "AND lrn.user_id\r\n"
						+ "NOT IN(SELECT user_user_id FROM batch_user)")
				.setParameter("schedulingId", schedulingId).getResultList();
	}

	/**
	 * @author abishek.kumar
	 * 
	 *         This "getLearningBatchReport" method is used to get all learning
	 *         assessment details with overall percentages in the particular
	 *         assessment from the database.
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> getLearningBatchReport(int batchId) {
		return entityManager.createNativeQuery(
				"SELECT DISTINCT schl.scheduling_id, ROUND(AVG(sc.score),2) AS avg_score, ast.assessment_id, ast.assessment_name "
						+ "FROM batch_user b "
						+ "JOIN learning_assessment_score_card_tbl sc ON sc.user_id = b.user_user_id "
						+ "JOIN schedule_assessment_tbl schl ON schl.scheduling_id = sc.schedule_assessment_id "
						+ "JOIN assessment ast ON ast.assessment_id = schl.assessment_id "
						+ "WHERE b.batch_batch_id = :batchId "
						+ "GROUP BY schl.scheduling_id, ast.assessment_id, ast.assessment_name")
				.setParameter("batchId", batchId).getResultList();

	}

	/**
	 * @author abishek.kumar
	 * 
	 *         This "getLearningBatchUserReport" method is used to get list of users
	 *         who had attempt in that particular learning assessment in batch from
	 *         the database.
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> getLearningBatchUserReport(int batchId, int assessmentId) {
		return entityManager.createNativeQuery(
				"SELECT u.user_id, u.user_email, u.user_name, sc.score, sc.status, sc.completion_status, "
						+ "scl.duration, scl.assessment_date, scl.start_time, ast.assessment_name, ast.assessment_id, sc.schedule_assessment_id "
						+ "FROM batch_user b "
						+ "JOIN learning_assessment_score_card_tbl sc ON sc.user_id = b.user_user_id "
						+ "JOIN schedule_assessment_tbl scl ON scl.scheduling_id = sc.schedule_assessment_id "
						+ "JOIN assessment ast ON ast.assessment_id = scl.assessment_id "
						+ "JOIN user_tbl u ON u.user_id = sc.user_id "
						+ "WHERE b.batch_batch_id = :batchId AND ast.assessment_id = :assessmentId")
				.setParameter("batchId", batchId).setParameter("assessmentId", assessmentId).getResultList();
	}

	/**
	 * @author abishek.kumar
	 * 
	 *         This "findSkillBatchReport" method is used to get all skill
	 *         assessment details with overall percentage or mark in that assessment
	 *         from database.
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> findSkillBatchReport(int batchId) {
		return entityManager.createNativeQuery("SELECT b.batch_batch_id, s.scheduling_id, ask.assessment_id, "
				+ "ROUND(AVG(s.total_score),2) AS avg_score, ask.assessment_name " + "FROM batch_user b "
				+ "JOIN skill_attempt_tbl s ON b.user_user_id = s.user_id "
				+ "JOIN schedule_assessment_tbl sa ON s.scheduling_id = sa.scheduling_id "
				+ "JOIN assessment ask ON sa.assessment_id = ask.assessment_id " + "WHERE b.batch_batch_id = :batchId "
				+ "GROUP BY b.batch_batch_id, s.scheduling_id, ask.assessment_id, ask.assessment_name")
				.setParameter("batchId", batchId).getResultList();

	}

	/**
	 * @author abishek.kumar
	 * 
	 *         This "findSkillAssessmentBatchUsers" method is used to get user list
	 *         who had attempt that skill assessment in the batch from database.
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> findSkillAssessmentBatchUsers(int batchId, int assessmentId) {
		return entityManager
				.createNativeQuery("SELECT u.user_id, u.user_email, u.user_name, sk.total_score, sk.status, "
						+ "at.assessment_name, sa.start_time, sa.assessment_date, sa.duration, "
						+ "at.assessment_id, sk.scheduling_id, sk.attempt_id " + "FROM batch_user b "
						+ "JOIN skill_attempt_tbl sk ON b.user_user_id = sk.user_id "
						+ "JOIN schedule_assessment_tbl sa ON sa.scheduling_id = sk.scheduling_id "
						+ "JOIN user_tbl u ON u.user_id = sk.user_id "
						+ "JOIN assessment at ON at.assessment_id = sa.assessment_id "
						+ "WHERE b.batch_batch_id = :batchId AND at.assessment_id = :assessmentId")
				.setParameter("batchId", batchId).setParameter("assessmentId", assessmentId).getResultList();

	}

	/**
	 * @author abishek.kumar
	 * 
	 *         This "getOverallLearningBatchReport" method is used to get list of
	 *         batch with overall mark or percentage for the assessment where the
	 *         batch members were attempted from database.
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> getOverallLearningBatchReport() {
		return entityManager
				.createNativeQuery("SELECT b.batch_batch_id, bt.batch_name, ROUND(AVG(ls.score), 2) AS avg_score "
						+ "FROM batch_user b " + "JOIN batch bt ON bt.batch_id = b.batch_batch_id "
						+ "JOIN learning_assessment_score_card_tbl ls ON ls.user_id = b.user_user_id "
						+ "GROUP BY b.batch_batch_id, bt.batch_name")
				.getResultList();

	}

	/**
	 * @author abishek.kumar
	 * 
	 *         This "findOverallSkillBatchReport" method is used to get list of
	 *         batch with overall mark or percentage for the skill assessment where
	 *         the batch members were attempted from database.
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> findOverallSkillBatchReport() {
		return entityManager
				.createNativeQuery("SELECT b.batch_batch_id, bt.batch_name, ROUND(AVG(sk.total_score), 2) AS avg_score "
						+ "FROM batch_user b " + "JOIN batch bt ON bt.batch_id = b.batch_batch_id "
						+ "JOIN skill_attempt_tbl sk ON sk.user_id = b.user_user_id "
						+ "GROUP BY b.batch_batch_id, bt.batch_name")
				.getResultList();

	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> findAllSkillAssessment() {
		return entityManager
				.createNativeQuery(
						"SELECT skl.scheduling_id, ast.assessment_name\r\n" + "FROM skill_attempt_tbl skl\r\n"
								+ "JOIN schedule_assessment_tbl schl ON schl.scheduling_id = skl.scheduling_id\r\n"
								+ "JOIN assessment ast ON ast.assessment_id = schl.assessment_id\r\n"
								+ "WHERE skl.user_id\r\n" + "NOT IN(SELECT user_user_id FROM batch_user)")
				.getResultList();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object[]> findAllKnowledgeAssessment() {
		return entityManager.createNativeQuery("SELECT schedule_assessment_id,ast.assessment_name\r\n"
				+ "FROM learning_assessment_score_card_tbl lrn\r\n"
				+ "JOIN schedule_assessment_tbl schl ON schl.scheduling_id = lrn.schedule_assessment_id\r\n"
				+ "JOIN assessment ast ON ast.assessment_id = schl.assessment_id\r\n" + "WHERE lrn.user_id\r\n"
				+ "NOT IN (SELECT user_user_id FROM batch_user)").getResultList();
	}

	@Override
	public Object[] findOverAllSkillKnowledgeScoreUnBatchedUsers() {
		return (Object[]) entityManager.createNativeQuery("SELECT \r\n"
				+ "(SELECT ROUND(COALESCE(AVG(lrn.score), 0), 2) \r\n"
				+ "     FROM learning_assessment_score_card_tbl lrn \r\n"
				+ "     WHERE lrn.score IS NOT NULL AND lrn.user_id NOT IN(SELECT user_user_id FROM batch_user) ) AS knowledgeAverageScore,\r\n"
				+ "    (SELECT ROUND(COALESCE(AVG(skl.total_score), 0), 2) \r\n"
				+ "     FROM skill_attempt_tbl skl \r\n"
				+ "     WHERE skl.total_score IS NOT NULL and skl.user_id NOT IN(SELECT user_user_id FROM batch_user)) AS skillAverageScore")
				.getSingleResult();
	}

	@Override
	public Object[] findKnowledgeOverallAssessmentCount() {
		return (Object[]) entityManager.createNativeQuery("SELECT  \r\n"
				+ "(SELECT COUNT(*) FROM learning_assessment_tbl lrn\r\n"
				+ "JOIN schedule_assessment_tbl schl ON schl.assessment_id = lrn.assessment_id AND schl.scheduled_status = \"scheduled\") AS Learning,\r\n"
				+ "(SELECT COUNT(*) FROM level_zero_learning_assessment_tbl lzero\r\n"
				+ "JOIN schedule_assessment_tbl schl ON schl.assessment_id = lzero.assessment_id AND schl.scheduled_status = \"scheduled\"  ) AS L0,\r\n"
				+ "(SELECT count(*) FROM quick_learning_assessment_tbl lquick\r\n"
				+ "JOIN schedule_assessment_tbl schl ON schl.assessment_id = lquick.assessment_id AND schl.scheduled_status = \"scheduled\") AS L1,\r\n"
				+ "(SELECT count(*) FROM moderate_learning_assesment_tbl lmod\r\n"
				+ "JOIN schedule_assessment_tbl schl ON schl.assessment_id = lmod.assessment_id AND schl.scheduled_status = \"scheduled\") AS L2,\r\n"
				+ "(SELECT count(*) FROM level_three_learning_assessment lthree\r\n"
				+ "JOIN schedule_assessment_tbl schl ON schl.assessment_id = lthree.assessment_assessment_id AND schl.scheduled_status = \"scheduled\") AS L3")
				.getSingleResult();
	}

	@Override
	public long findAllScheduledSkillAssessment() {
		return (long) entityManager.createNativeQuery("SELECT COUNT(*) AS SkillCount\r\n"
				+ "FROM skillassessment_tbl skl\r\n"
				+ "JOIN schedule_assessment_tbl schl ON schl.assessment_id = skl.assessment_id AND schl.scheduled_status = \"scheduled\"")
				.getSingleResult();
	}

}
