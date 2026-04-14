package com.rts.cap.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.LearningAssessmentQbDao;
import com.rts.cap.dto.LearningAssessementSingleQuestionDto;
import com.rts.cap.dto.QuestionDto;
import com.rts.cap.dto.RowUploadStatusDto;
import com.rts.cap.dto.UploadReportDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Answer;
import com.rts.cap.model.MultipleChoiceQuestion;
import com.rts.cap.model.Subtopic;
import com.rts.cap.model.Topic;
import com.rts.cap.service.LearningAssessmentQbService;
import com.rts.cap.utils.CommonUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@Service
@RequiredArgsConstructor
public class LearningAssessmentQbServiceImpl implements LearningAssessmentQbService {

	private final LearningAssessmentQbDao assessmentQbDao;

	private static final Logger LOGGER = LogManager.getLogger(LearningAssessmentQbServiceImpl.class);

	/**
	 * This is the method which is used for add or updating learning Assessment
	 * questions and Options business logic.
	 * 
	 * @param LearningAssessementSingleQuestionDto
	 * @return boolean
	 * 
	 */
	@Override
	@Transactional
	public boolean addOrUpdateLearningAssessmentSingleQuestion(LearningAssessementSingleQuestionDto dto) {

		try {
			if (dto == null || dto.getQuestion() == null || dto.getAnswer() == null) {
				return MessageConstants.FALSE_VARIABLE;
			}

			MultipleChoiceQuestion question = dto.getQuestion();
			List<Answer> answers = dto.getAnswer();

			boolean questionAdded = addQuestion(question);
			boolean allAnswersAdded = addAnswers(question, answers);

			return questionAdded && allAnswersAdded;
		} catch (Exception e) {
			LOGGER.error("Error Occuring While Adding SingleQuestions", e);
			return MessageConstants.FALSE_VARIABLE;
		}
	}

	/**
	 * This is the method which is used for add or updating learning Assessment
	 * questions business logic.
	 * 
	 * @param MultipleChoiceQuestion
	 * @return boolean
	 * 
	 */
	private boolean addQuestion(MultipleChoiceQuestion question) {
		if (question.getSubtopic() != null && question.getSubtopic().getTopic() != null) {
			Subtopic subtopic = question.getSubtopic();

			subtopic.setTopic(assessmentQbDao.getTopicById(subtopic.getTopic().getTopicId())); // Fetch or persist topic
																								// if needed
			subtopic.setSubtopicName(
					assessmentQbDao.getSubtopicById(question.getSubtopic().getSubtopicId()).getSubtopicName());

			question.setSubtopic(subtopic); // Set managed subtopic
			question.setIsActive(MessageConstants.IS_ACTIVE);
		}

		return assessmentQbDao.addOrUpdateLearningAssessmentSingleQuestion(question);
	}

	/**
	 * This is the method which is used for add or updating learning Assessment
	 * Options business logic. set the connected objects (Topic and Subtopic) in
	 * questions then perform add option into database Add the Options into Answers
	 * table to send
	 * 
	 * @param MultipleChoiceQuestion,
	 * @param List<Answer>
	 * @return boolean
	 * 
	 */
	private boolean addAnswers(MultipleChoiceQuestion question, List<Answer> answers) {

		MultipleChoiceQuestion questions = assessmentQbDao.getQuestionByName(question.getContent());

		LOGGER.info("Uploading Knowledge Question Id : {}", questions.getQuestionId());

		boolean flag = answers.stream().map(answer -> {
			answer.setCorrectAnswer(answer.getOptionMark() > 0 ? 1 : 0); // Set correct answer based on OptionMark
			answer.setQuestion(questions); // Set the question for this answer
			return assessmentQbDao.addOrUpdateLearningAssessmentSingleAnswer(answer);
		}).reduce((t1, t2) -> t1 && t2).orElse(MessageConstants.FALSE_VARIABLE);

		LOGGER.info("Knowledge Question's Answer insertion result : {}", flag);

		return flag;

	}

	/**
	 * Retrieves a list of possible answers for a specific multiple-choice question.
	 * return all the possible answers for that question.
	 * 
	 * @param questionId
	 * @return List<Answer>
	 */
	@Override
	public List<Answer> getLearningAssessmentSingleQuestion(int questionId) {
		return assessmentQbDao.getMultipleChoiceQuestionById(questionId);
	}

	/**
	 * Retrieves a list of all topics available in the assessment system.
	 * 
	 * @return List<Topic>
	 * 
	 */
	@Override
	public List<Topic> getAllTopics() {
		return assessmentQbDao.getAllTopics();
	}

	/**
	 * Retrieves a list of subtopics associated with a specific topic.
	 * 
	 * @param topicId
	 */
	@Override
	public List<Subtopic> getSubtopicBasedOnTopic(int topicId) {
		return assessmentQbDao.getSubtopicBasedOnTopic(topicId);
	}

	/**
	 * Deletes a single question along with its associated options (answers).
	 * 
	 * @param questionId
	 * @return boolean
	 */
	@Override
	public boolean deleteSingleQuestionWithOptions(int questionId) {
		try {
			return assessmentQbDao.deleteSingleQuestion(questionId);
		} catch (Exception e) {
			LOGGER.error("Error Occured while deleting single question with options:", e);
			return MessageConstants.FALSE_VARIABLE;
		}
	}

	@Override
	public boolean updateSingleQuestionStatus(int questionId, String status) {
		return assessmentQbDao.updateSingleQuestionStatus(questionId, status);
	}

	/**
	 * Adds a new topic or updates an existing topic based on the provided data.
	 * 
	 * @param topic
	 * @return boolean
	 */
	@Override
	public boolean addOrUpdateTopic(Topic topic) {

		try {
			topic.setTopicCreationDate(
			LocalDate.now().format(DateTimeFormatter.ofPattern(MessageConstants.DATE_FORMAT)));
			return assessmentQbDao.addOrUpdateTopics(topic);
		} catch (Exception e) {
			LOGGER.error("Error Occurs during Add or Update Topics:", e);
			return MessageConstants.FALSE_VARIABLE;
		}

	}

	/**
	 * Adds a new subtopic or updates an existing subtopic based on the provided
	 * data.
	 * 
	 * @param subtopic
	 * @return boolean
	 */
	@Override
	public boolean addOrUpdateSubTopic(Subtopic subtopic) {
		try {
			return assessmentQbDao.addOrUpdateSubtopic(subtopic);
		} catch (Exception e) {
			LOGGER.error("Error Occurs during Add or Update Subtopics:", e);
			return MessageConstants.FALSE_VARIABLE;
		}

	}

	/**
	 * Deletes a single answer option from the system.
	 * 
	 * @param answerId
	 * @return boolean
	 */
	@Override
	@Transactional
	public boolean deleteSingleAnswer(int answerId) {
		try {
			return assessmentQbDao.deleteSingleAnswer(answerId);

		} catch (Exception e) {
			LOGGER.error("Error Occured while deleting Single Answer", e);
			return MessageConstants.FALSE_VARIABLE;
		}
	}

	  @Override
	 @Transactional
	public UploadReportDto excelToQuestions(InputStream inputStream) throws IOException, CapBusinessException {
		UploadReportDto report = new UploadReportDto(0);

		try (Workbook workbook = WorkbookFactory.create(inputStream)) {
			Sheet sheet = workbook.getSheetAt(0);
			Iterator<Row> rowIterator = sheet.iterator();
			CommonUtils.skipHeaderRow(rowIterator);
			processRows(rowIterator, report);
		} catch (IOException | EncryptedDocumentException e) {
			LOGGER.error("Error reading Excel file", e);
			throw new CapBusinessException("Error reading Excel file");
		}

		return report;
	}
	
	private void processRows(Iterator<Row> rowIterator, UploadReportDto report) {
        int rowIndex = MessageConstants.HEADER_ROW;
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            if (CommonUtils.isEndOfFile(row)) break;
 
            RowUploadStatusDto status = createQuestionFromRow(row);
            report.setTotalRows(report.getTotalRows() + 1);
 
            if (status.isSuccess()) {
                report.incrementSuccessfulUploads();
            } else {
                report.addSkippedRow(rowIndex, status.getReason());
            }
 
            rowIndex++;
        }
    }
	
	
	private RowUploadStatusDto createQuestionFromRow(Row row) {
        try {
            String questionContent = CommonUtils.getStringCellValue(row, MessageConstants.QUESTION_COLUMN);
            String complexity = CommonUtils.getStringCellValue(row, MessageConstants.COMPLEXITY_COLUMN);
            String questionType = CommonUtils.getStringCellValue(row, MessageConstants.QUESTION_TYPE_COLUMN);
            String topicName = CommonUtils.getStringCellValue(row, MessageConstants.TOPIC_COLUMN);
            String subtopicName = CommonUtils.getStringCellValue(row, MessageConstants.SUBTOPIC_COLUMN);
            int mark = CommonUtils.parseMark(CommonUtils.getStringCellValue(row, MessageConstants.MARK_COLUMN));
            List<String> optionContents = CommonUtils.getOptionContents(row);
            String[] correctOptions = CommonUtils.getCorrectOptions(row);
 
            Optional<RowUploadStatusDto> status = validateQuestionData(questionContent, complexity, questionType, topicName, subtopicName, mark, optionContents, correctOptions);
          
            if (status.isPresent() ) {
            	 return status.get();
            }
            
            QuestionDto questionDTO = new QuestionDto(questionContent, complexity, questionType, topicName, subtopicName, mark, optionContents.toArray(new String[0]), correctOptions);
            boolean result = processQuestion(questionDTO);
            return new RowUploadStatusDto(result, null); // Null reason indicates success
        } catch (Exception e) {
            LOGGER.error("Error processing row", e);
            System.err.println(e);
            return new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.GENERAL_ERROR_REASON);
        }
    }
	
	 private Optional<RowUploadStatusDto> validateQuestionData(String questionContent, String complexity, String questionType, String topicName, String subtopicName, int mark, List<String> optionContents, String[] correctOptions) {
	        return validateContent(questionContent, MessageConstants.QUESTION_REASON)
	                .or(() -> CommonUtils.validateComplexity(complexity))
	                .or(() -> CommonUtils.validateQuestionType(questionType))
	                .or(() -> validateContent(topicName, MessageConstants.TOPIC_REASON))
	                .or(() -> validateContent(subtopicName, MessageConstants.SUBTOPIC_REASON))
	                .or(() -> CommonUtils.validateMark(mark))
	                .or(() -> CommonUtils.validateOptions(optionContents))
	                .or(() -> CommonUtils.validateCorrectOptions(correctOptions, optionContents));
	                
	    }
	 
	 private Optional<RowUploadStatusDto> validateContent(String content, String reason) {
	        if (content.isEmpty()) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, reason));
	        } else if (content.length() > 300) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.QUESTION_CHARECTOR_REASON));
	        } else if (assessmentQbDao.questionExistOrNot(content)) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.QUESTION_EXIST_REASON));
	        }
	        return Optional.empty();
	    }
	 
	   @Transactional
	    public boolean processQuestion(QuestionDto questionDTO) {
	        if (questionDTO == null || questionDTO.isEmpty()) {
	            return MessageConstants.FALSE_VARIABLE;
	        }
	 
	        Topic topic = assessmentQbDao.getOrCreateTopic(questionDTO.getTopicName());
	        Subtopic subtopic = assessmentQbDao.getOrCreateSubtopic(topic, questionDTO.getSubtopicName());
	        MultipleChoiceQuestion question = createQuestion(topic, subtopic, questionDTO);
	        List<Answer> answers = createAnswers(question, questionDTO);
	        return !answers.isEmpty();
	    }
	 
	 private MultipleChoiceQuestion createQuestion(Topic topic, Subtopic subtopic, QuestionDto questionDTO) {
	    	MultipleChoiceQuestion question = new MultipleChoiceQuestion();
	        question.setComplexity(questionDTO.getComplexity());
	        question.setContent(questionDTO.getContent());
	        question.setMark(questionDTO.getMark());
	        question.setIsActive(MessageConstants.IS_ACTIVE);
	        question.setQuestionType(questionDTO.getQuestionType());
	        question.setSubtopic(subtopic);
	        question.getSubtopic().setTopic(topic);
	        return assessmentQbDao.addOrUpdateLearningAssessmentSingleQuestion(question)? question : null;
	    }
	 
	 private List<Answer> createAnswers(MultipleChoiceQuestion question, QuestionDto questionDTO){
	    	return Arrays.asList(questionDTO.getOptionContents()).stream()
		            .map(optionContent -> {
		                Answer answer = new Answer();
		                answer.setOptionContent(optionContent);
		                answer.setOptionMark(Arrays.asList(questionDTO.getCorrectOptions()).contains(optionContent) ? (double) questionDTO.getMark() / questionDTO.getCorrectOptions().length : 0); // Divide mark equally for MSQ
		                answer.setQuestion(question);
		                answer.setCorrectAnswer(Arrays.asList(questionDTO.getCorrectOptions()).contains(optionContent) ? 1 : 0);     
		                return assessmentQbDao.addOrUpdateLearningAssessmentSingleAnswer(answer) ? answer : null;
		            })
		            .toList();
	    }

}
