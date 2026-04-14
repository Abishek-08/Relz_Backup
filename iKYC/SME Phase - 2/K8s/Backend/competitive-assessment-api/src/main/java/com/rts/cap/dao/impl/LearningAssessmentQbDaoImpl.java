package com.rts.cap.dao.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LearningAssessmentQbDao;
import com.rts.cap.model.Answer;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.Subtopic;
import com.rts.cap.model.Topic;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@Repository
public class LearningAssessmentQbDaoImpl implements LearningAssessmentQbDao {

	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * Retrieves a Topic based on the provided topic ID.
	 *
	 * @param topicId the ID of the topic to retrieve
	 * @return the Topic associated with the given ID
	 */

	@Override
	public Topic getTopicById(int topicId) {
		return entityManager.find(Topic.class, topicId);
	}

	/**
	 * Retrieves a MultipleChoiceQuestion based on the provided question ID.
	 *
	 * @param questionId the ID of the question to retrieve
	 * @return the MultipleChoiceQuestion associated with the given ID
	 */

	@Override
	public MultipleChoiceQuestion getQuestionById(int questionId) {
		return entityManager.find(MultipleChoiceQuestion.class, questionId);
	}

	/**
	 * Retrieves a MultipleChoiceQuestion based on the provided content.
	 *
	 * @param content the content of the question to retrieve
	 * @return the MultipleChoiceQuestion associated with the given content
	 * @throws NoResultException if no question with the given content is found
	 */

	@Override
	public MultipleChoiceQuestion getQuestionByName(String content) {
		return (MultipleChoiceQuestion) entityManager
				.createQuery("select q from MultipleChoiceQuestion q where q.content = :content")
				.setParameter("content", content).getSingleResult();
	}

	/**
	 * Adds a new MultipleChoiceQuestion or updates an existing one based on the
	 * provided question
	 * 
	 * @param question the MultipleChoiceQuestion to add or update
	 * @return true if the operation was successful; false otherwise
	 */

	@Override
	public boolean addOrUpdateLearningAssessmentSingleQuestion(MultipleChoiceQuestion question) {
	     
		if(question.getQuestionId()>0)
			entityManager.merge(question); 
		else 
			entityManager.persist(question);
		
		return MessageConstants.TRUE_VARIABLE;
	}

	/**
	 * Adds a new Answer or updates an existing one based on the provided answer.
	 *
	 *
	 * @param answer the Answer to add or update
	 * @return true if the operation was successful; false otherwise
	 */

	@Override
	public boolean addOrUpdateLearningAssessmentSingleAnswer(Answer answer) {
		if(answer.getOptionId()>0)
			entityManager.merge(answer); 
		else 
		   entityManager.persist(answer);
		
	 return MessageConstants.TRUE_VARIABLE;
		
	}

	/**
	 * Retrieves a Subtopic based on the provided subtopic ID.
	 *
	 * @param subtopicId the ID of the subtopic to retrieve
	 * @return the Subtopic associated with the given ID, or null if no such
	 *         subtopic is found
	 */

	@Override
	public Subtopic getSubtopicById(int subtopicId) {
		return entityManager.find(Subtopic.class, subtopicId);
	}

	/**
	 * Retrieves a list of Answer entities associated with the specified question
	 * ID.
	 * 
	 * @param questionId the ID of the MultipleChoiceQuestion whose answers are to
	 *                   be retrieved
	 * @return a list of Answer entities associated with the given question ID
	 */

	@Override
	@SuppressWarnings("unchecked")
	public List<Answer> getMultipleChoiceQuestionById(int questionId) {
		return entityManager.createQuery("from Answer q where q.question.questionId=:questionId")
				.setParameter(MessageConstants.LEARNING_ASSESSMENT_QUESTION_ID, questionId).getResultList();
	}

	/**
	 * Retrieves a list of all Topic entities from the database.
	 *
	 * @return a list of all Topic entities
	 */

	@SuppressWarnings("unchecked")
	@Override
	public List<Topic> getAllTopics() {
		return entityManager.createQuery("from Topic").getResultList();
	}

	/**
	 * Retrieves a list of Subtopic entities associated with the specified topic ID.
	 *
	 * @param topicId the ID of the Topic whose subtopics are to be retrieved
	 * @return a list of Subtopic entities associated with the given topic ID
	 */

	@SuppressWarnings("unchecked")
	@Override
	public List<Subtopic> getSubtopicBasedOnTopic(int topicId) {
		return entityManager.createQuery("from Subtopic s where s.topic.topicId = :topicId")
				.setParameter("topicId", topicId).getResultList();
	}

	/**
	 * Deletes a MultipleChoiceQuestion and its associated Answer entities based on
	 * the provided question ID.
	 * 
	 * @param questionId the ID of the MultipleChoiceQuestion to delete
	 * @return true if the question and its associated answers were successfully
	 *         deleted; false otherwise
	 */

	@Override
	@Transactional
	public boolean deleteSingleQuestion(int questionId) {
		MultipleChoiceQuestion mcq = entityManager.find(MultipleChoiceQuestion.class, questionId);
		if (mcq != null) {
			int execute = entityManager.createQuery("DELETE FROM Answer a WHERE a.question = :question")
					.setParameter("question", mcq).executeUpdate();

			if (execute > 0) {
				// Delete the question
				entityManager.remove(mcq);
				return MessageConstants.TRUE_VARIABLE;
			}
		}
		return MessageConstants.FALSE_VARIABLE;
	}

	/**
	 * Enables a MultipleChoiceQuestion by updating its status based on the provided
	 * question ID.
	 * 
	 * @param questionId the ID of the MultipleChoiceQuestion to enable
	 * @return true if the status update was successful (i.e., one or more rows were
	 *         affected); false otherwise
	 */

	@Override
	@Transactional
	public boolean updateSingleQuestionStatus(int questionId, String status) {
		int execute = entityManager
				.createQuery(
						"UPDATE MultipleChoiceQuestion m SET m.isActive = :newStatus WHERE m.questionId = :questionId")
				.setParameter("questionId", questionId).setParameter("newStatus", status).executeUpdate();

		return execute > 0;
	}

	/**
	 * Adds a new Topic or updates an existing one based on the provided Topic
	 * entity.
	 * 
	 * @param topic the Topic entity to add or update
	 * @return true if the operation was successful; false otherwise
	 */

	@Override
	@Transactional
	public boolean addOrUpdateTopics(Topic topic) {

		if (topic != null && topic.getTopicId() > 0) {
			entityManager.merge(topic);
		} else {
			entityManager.persist(topic);
		}
		return MessageConstants.TRUE_VARIABLE;

	}

	/**
	 * Adds a new Subtopic or updates an existing one based on the provided Subtopic
	 * entity.
	 *
	 * @param subtopic the Subtopic entity to add or update
	 * @return true if the Subtopic was successfully added; false otherwise
	 */

	@Override
	@Transactional
	public boolean addOrUpdateSubtopic(Subtopic subtopic) {

		if (subtopic == null || subtopic.getTopic().getTopicId() <= 0 || subtopic.getSubtopicId() > 0) {
			return false;
		}

		subtopic.setTopic(entityManager.find(Topic.class, subtopic.getTopic().getTopicId()));
		// Check if subtopic already exists
		if (subtopicExistOrNot(subtopic.getSubtopicName(), subtopic.getTopic().getTopicName())) {
			return false;
		}
		entityManager.persist(subtopic);
		return MessageConstants.TRUE_VARIABLE;

	}

	/**
	 * Checks whether a Subtopic with the specified name already exists under the
	 * given topic.
	 * 
	 * @param subtopic the name of the Subtopic to check for existence
	 * @param topic    the name of the Topic under which the Subtopic should be
	 *                 checked
	 * @return true if a Subtopic with the given name exists under the specified
	 *         Topic; false otherwise
	 */

	public boolean subtopicExistOrNot(String subtopic, String topic) {
		return entityManager.createQuery(
				"select count(s) from Subtopic s where s.subtopicName = :subtopicName AND s.topic.topicName = :topicName",
				Long.class).setParameter("subtopicName", subtopic).setParameter("topicName", topic)
				.getSingleResult() > 0;
	}


	/**
	 * Deletes an Answer entity based on the provided answer ID.
	 *
	 * @param answerId the ID of the Answer to delete
	 * @return true if the Answer was successfully deleted; false if no Answer with
	 *         the given ID was found
	 */

	@Override
	public boolean deleteSingleAnswer(int answerId) {
		Answer answer = entityManager.find(Answer.class, answerId);
		if (answer != null) {
			entityManager.remove(answer);
			return MessageConstants.TRUE_VARIABLE;
		}
		return MessageConstants.FALSE_VARIABLE;
	}
	
	/**
	  * This method is used for if the particular question is exist in a database 
	  * @param questionContent
	  */
	
	@Override
	public boolean questionExistOrNot(String questionContent) {
	    return entityManager.createQuery(
	            "select count(q) from MultipleChoiceQuestion q where q.content = :content", Long.class)
	            .setParameter("content", questionContent).getSingleResult()>0;
	}
	
	
	 /**
	  * This method is used for get or create a topic,it'll return same topic if exist or else it'll
	  * create a new one.
	  * @param topicName
	  */
	@Override
	public Topic getOrCreateTopic(String topicName) {
		   // Check if topic exists in database
		Topic topic = entityManager.createQuery("SELECT t FROM Topic t WHERE t.topicName = :name", Topic.class)
				.setParameter("name", topicName).getResultList().stream().findFirst().orElse(new Topic());

		if (topic.getTopicId() == 0) {
			topic.setTopicName(topicName);
			topic.setTopicCreationDate(
					LocalDate.now().format(DateTimeFormatter.ofPattern(MessageConstants.DATE_FORMAT)));
			entityManager.persist(topic);
		}
       return topic;
	}
	
	/**
	  * This method is used for get or create a subtopic,it'll return same subtopic if exist or else it'll
	  * create a new one.
	  * @param topic , subtopicName
	  */
	@Override
	public Subtopic getOrCreateSubtopic(Topic topic, String subtopicName) {
		 // Check if subtopic exists in database
       Subtopic subtopic = entityManager.createQuery("SELECT s FROM Subtopic s WHERE s.subtopicName = :name AND s.topic = :topic", Subtopic.class)
               .setParameter("name", subtopicName)
               .setParameter("topic", topic)
               .getResultList()
               .stream()
               .findFirst()
               .orElse(new Subtopic());

       if (subtopic.getSubtopicId() == 0) {
           subtopic.setSubtopicName(subtopicName);
           subtopic.setTopic(topic);
           entityManager.persist(subtopic);
       }

       return subtopic;
	}
}
