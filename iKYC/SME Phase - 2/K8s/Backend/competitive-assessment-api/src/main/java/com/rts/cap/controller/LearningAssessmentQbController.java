package com.rts.cap.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rts.cap.constants.APIConstants;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dto.LearningAssessementSingleQuestionDto;
import com.rts.cap.dto.UploadReportDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Answer;
import com.rts.cap.model.Subtopic;
import com.rts.cap.model.Topic;
import com.rts.cap.service.LearningAssessmentQbService;

/**
 * @author prasanth.baskaran , karpagam.boothanathan
 * @since 28-06-2024
 * @version 1.0
 */

@RestController
@RequestMapping(path = APIConstants.LEARNING_BASE_URL)
public class LearningAssessmentQbController {

	/**
	 * This is a Parameterized Constructor Dependency injection using constructor
	 * 
	 * @param assessmentQbService
	 */
	private final LearningAssessmentQbService learningAssessmentQbService;

	public LearningAssessmentQbController(LearningAssessmentQbService learningAssessmentQbService) {
		this.learningAssessmentQbService = learningAssessmentQbService;
	}

	// controller method for single question and Answer upload
	@PostMapping(APIConstants.ADD_LEARNING_ASSESSMENT_SINGLE_QUESTION_URL)
	public boolean addLearningAssessmentSingleQuestion(
			@RequestBody LearningAssessementSingleQuestionDto assessementSingleQuestionDto) {
		return learningAssessmentQbService.addOrUpdateLearningAssessmentSingleQuestion(assessementSingleQuestionDto);
	}

	// controller Get method for single question with connected options
	@GetMapping(APIConstants.GET_LEARNING_ASSESSMENT_SINGLE_QUESTION_URL + "/{questionId}")
	public List<Answer> getLearningAssessmentSingleQuestion(@PathVariable("questionId") int questionId) {
		return learningAssessmentQbService.getLearningAssessmentSingleQuestion(questionId);
	}

	// controller method for single question and Answer update
	@PutMapping(APIConstants.UPDATE_LEARNING_ASSESSMENT_SINGLE_QUESTION_URL)
	public boolean updateLearningAssessmentSingleQuestion(
			@RequestBody LearningAssessementSingleQuestionDto assessementSingleQuestionDto) {
		return learningAssessmentQbService.addOrUpdateLearningAssessmentSingleQuestion(assessementSingleQuestionDto);
	}

	// controller for get all Learning Assessment Topics List
	@GetMapping(APIConstants.GET_ALL_LEARNING_ASSESSMENT_TOPICS_URL)
	public List<Topic> getAllTopics() {
		return learningAssessmentQbService.getAllTopics();
	}

	// controller for get Subtopic List based on given topic Id
	@GetMapping(APIConstants.GET_LEARNING_ASSESSMENT_SUBTOPIC_BASED_ON_TOPIC_URL + "/{topicId}")
	public List<Subtopic> getSubtopicsBasedOnTopic(@PathVariable("topicId") int topicId) {
		return learningAssessmentQbService.getSubtopicBasedOnTopic(topicId);
	}

	// controller for deleting a single question with connected with all options
	@DeleteMapping(APIConstants.DELETE_LEARNING_ASSESSMENT_SINGLE_QUESTION_URL + "/{questionId}")
	public boolean deleteSingleQuestionWithOptions(@PathVariable("questionId") int questionId) {
		return learningAssessmentQbService.deleteSingleQuestionWithOptions(questionId);
	}

	// controller for enable a single question
		@PutMapping(APIConstants.UPDATE_LEARNING_ASSESSMENT_QUESTION_STATUS_URL + "/{questionId}"+"/{status}")
		public boolean updateLearningAssessmentQuestionStatus(@PathVariable("questionId") int questionId,@PathVariable("status") String status) {
			return learningAssessmentQbService.updateSingleQuestionStatus(questionId, status);
		}
		
	// controller for add a new Topic
	@PostMapping(APIConstants.ADD_LEARNING_ASSESSMENT_TOPICS_URL)
	public ResponseEntity<Boolean> addLearningAssessmentTopic(@RequestBody Topic topic) {
		if (learningAssessmentQbService.addOrUpdateTopic(topic))
			return ResponseEntity.status(HttpStatus.OK).body(MessageConstants.TRUE_VARIABLE);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(MessageConstants.FALSE_VARIABLE);
	}

	// controller for add a new Subtopic
	@PostMapping(APIConstants.ADD_LEARNING_ASSESSMENT_SUBTOPIC_BASED_ON_TOPIC_URL)
	public ResponseEntity<Boolean> addLearningAssessmentSubtopic(@RequestBody Subtopic subtopic) {
		if (learningAssessmentQbService.addOrUpdateSubTopic(subtopic))
			return ResponseEntity.status(HttpStatus.OK).body(MessageConstants.TRUE_VARIABLE);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(MessageConstants.FALSE_VARIABLE);
	}

	// controller for delete single question update options (answers)
	@DeleteMapping(APIConstants.DELETE_LEARNING_ASSESSMENT_SINGLE_ANSWER_URL + "/{answerId}")
	public boolean deleteSingleAnswer(@PathVariable("answerId") int answerId) {
		return learningAssessmentQbService.deleteSingleAnswer(answerId);
	}
	
	//This controller for bulk question upload using spreadsheet
	  @PostMapping(APIConstants.BULK_QUESTION_UPLOAD)
	    public ResponseEntity<UploadReportDto> uploadSpreadsheet(@RequestParam("file") MultipartFile file) throws IOException, CapBusinessException {
		 return !file.isEmpty()?ResponseEntity.ok().body(learningAssessmentQbService.excelToQuestions(file.getInputStream())) :
			 ResponseEntity.badRequest().build();
	  }

}
