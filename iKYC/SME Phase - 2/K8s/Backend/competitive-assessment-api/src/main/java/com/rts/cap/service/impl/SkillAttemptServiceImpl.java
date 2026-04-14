package com.rts.cap.service.impl;

import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Properties;
import java.util.regex.Pattern;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.runner.JUnitCore;
import org.junit.runner.Request;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import org.mdkt.compiler.InMemoryJavaCompiler;
import org.python.core.Py;
import org.python.core.PyList;
import org.python.core.PyObject;
import org.python.util.PythonInterpreter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.CodingQuestionDao;
import com.rts.cap.dao.ScheduleAssessmentDao;
import com.rts.cap.dao.SkillAssessmentDao;
import com.rts.cap.dao.SkillAttemptDao;
import com.rts.cap.dao.SkillCommonDao;
import com.rts.cap.dao.UserDao;
import com.rts.cap.dto.AttemptResponseDto;
import com.rts.cap.dto.CodingQuestionDto;
import com.rts.cap.dto.CodingResponseDto;
import com.rts.cap.dto.RunResultDto;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.CodingQuestion;
import com.rts.cap.model.CodingQuestionFile;
import com.rts.cap.model.CodingQuestionRequest;
import com.rts.cap.model.Language;
import com.rts.cap.model.ScheduleAssessment;
import com.rts.cap.model.SkillAttempt;
import com.rts.cap.model.SkillResult;
import com.rts.cap.model.TestCase;
import com.rts.cap.model.TestResult;
import com.rts.cap.model.User;
import com.rts.cap.service.SkillAttemptService;
import com.rts.cap.utils.CommonUtils;

import lombok.RequiredArgsConstructor;

/**
 * @author dharshsun.s,vinolisha.vijayakumar, prem.mariyappan, sanjay.subramani,
 *         Srinivasan.S, vignesh.velusamy
 * @since 02-09-2024
 * @version 3.0
 */

/**
 * This interface implementation for Skill Attempt Service
 */
@Service
@Transactional
@RequiredArgsConstructor
public class SkillAttemptServiceImpl implements SkillAttemptService {

	private final SkillAttemptDao skillAttemptDao;
	private final UserDao userDao;
	private final ScheduleAssessmentDao scheduleAssessmentDao;
	private final CodingQuestionDao codingQuestionDao;
	private final SkillAssessmentDao skillAssessmentDao;
	private final SkillCommonDao skillCommonDao;

	private static final Logger LOGGER = LogManager.getLogger(SkillAttemptServiceImpl.class);

	/**
	 * Method for getting mapped question
	 * 
	 * @param skillAttemptId
	 * @return List<CodingQuestionDTO>
	 */
	@Override
	public List<CodingQuestionDto> getCodingQuestions(int attemptId) {
		return skillAttemptDao.findById(attemptId).getCodingQuestions().stream().map(CodingQuestionDto::new).toList();
	}

	/**
	 * @param userId       The ID of the user requesting the coding questions.
	 * @param schedulingId The ID of the scheduled assessment for which coding
	 *                     questions are requested.
	 * @return A list of CodingQuestionDTO objects representing the selected coding
	 *         questions.
	 */
	@Override
	public int mapCodingQuestion(int userId, int schedulingId) {
		User user = userDao.findUserById(userId);
		ScheduleAssessment scheduleAssessment = scheduleAssessmentDao.findScheduleAssessmentById(schedulingId);
		List<CodingQuestionRequest> codingQuestionRequests = skillAssessmentDao
				.getAllRequestBySkillAssessmentId(skillAssessmentDao
						.getSkillAssessmentByAssessmentId(scheduleAssessment.getAssessment().getAssessmentId())
						.getSkillAssessmentId());
		List<CodingQuestion> selectedQuestions = new ArrayList<>();

		codingQuestionRequests.stream().forEach(request -> {
			List<CodingQuestion> questions = codingQuestionDao
					.findRandomQuestions(request.getCategory().getCategoryId(), request.getLevel(), request.getCount());
			selectedQuestions.addAll(questions);
		});

		SkillAttempt skillAttempt = new SkillAttempt();
		skillAttempt.setUser(user);
		skillAttempt.setScheduleAssessment(scheduleAssessment);
		skillAttempt.setCodingQuestions(selectedQuestions);
		skillAttemptDao.createSkillAttempt(skillAttempt);
		LOGGER.info("Question Mapped and Assessment Initiated for user: {}", user.getUserEmail());
		return skillAttempt.getAttemptId();
	}

	/**
	 * Method for executing custom logic for Python Language
	 * 
	 * @param inputs
	 * @param code
	 * @param language
	 * @return String
	 */
	private String pythonCustomCode(String inputs, String code) {
		String output = null;
		PythonInterpreter pythonInterpreter = new PythonInterpreter();
		LOGGER.info("Custom run code logic running in Python language");
		try {
			String className = Pattern.compile(MessageConstants.CLASS_NAME_PATTERN_REGEX).matcher(code).results()
					.map(x -> x.group(1)).findFirst().orElseThrow();
			String methodName = Pattern.compile(MessageConstants.PYTHON_METHOD_NAME_PATTERN_REGEX).matcher(code)
					.results().map(x -> x.group(1)).findFirst().orElseThrow();
			LOGGER.info("Python Class Name: {}", className);
			LOGGER.info("Python Class Method Name: {}", methodName);
			Properties p = new Properties();
			p.setProperty(MessageConstants.PYTHON_PATH, MessageConstants.JYTHONJARPATH);
			p.setProperty(MessageConstants.PYTHON_HOME, MessageConstants.JYTHONJARPATH);
			p.setProperty(MessageConstants.PYTHON_PREFIX, MessageConstants.JYTHONJARPATH);
			PythonInterpreter.initialize(System.getProperties(), p, new String[] {});
			pythonInterpreter.exec(code);
			PyObject solutionClass = pythonInterpreter.eval(className + "()");
			PyObject method = solutionClass.__getattr__(methodName);
			PyObject[] pyArgs = convertInputsToPyObjects(inputs, method);
			PyObject result = method.__call__(pyArgs);
			output = result.toString();
		} catch (Exception e) {
			LOGGER.error("CustomExecuteCode Python Error", e);
			if (e.getCause() != null)
				output = getSpecificExceptionMessage(e);
			output = e.getMessage();
		} finally {
			pythonInterpreter.close();
		}
		return output;
	}

	/**
	 * This method is for convert the String input to method parameters with Python
	 * language
	 * 
	 * @param inputs
	 * @param parameterTypes It used to define the parameter type (ie) input type
	 * @return It returns the actual inputs
	 * @throws CapBusinessException
	 */
	private PyObject[] convertInputsToPyObjects(String inputs, PyObject method) {

		String[] inputArray = inputs.trim().split(MessageConstants.SPACE_SPLIT_REGEX);
		PyObject[] pyArgs = new PyObject[inputArray.length];
		for (int i = 0; i < inputArray.length; i++) {
			String input = inputArray[i];
			if (input.startsWith("[") && input.endsWith("]")) {
				LOGGER.info("Array is found in Python");
				String[] arrayElements = input.substring(1, inputArray[i].length() - 1)
						.split(MessageConstants.COMMA_SPLIT_REGEX);
				PyObject[] pyArg = new PyObject[arrayElements.length];
				for (int j = 0; j < arrayElements.length; j++) {
					pyArg[j] = convertPrimitivesPyObject(arrayElements[j]);
				}
				pyArgs[i] = new PyList(pyArg);
			} else {
				pyArgs[i] = convertPrimitivesPyObject(input);
			}
		}

		return pyArgs;
	}

	/**
	 * This method is for convert the String input to primitive data type for Python
	 * 
	 * @param type  This is the type of parameter
	 * @param value
	 * @return
	 * @throws CapBusinessException
	 */
	private PyObject convertPrimitivesPyObject(String input) {
		if (input.matches(MessageConstants.PYTHON_INT_PARSING))
			return Py.newInteger(Integer.parseInt(input));
		else if (input.matches(MessageConstants.PYTHON_FLOAT_PARSING))
			return Py.newFloat(Float.parseFloat(input));
		else
			return Py.newString(input);
	}

	/**
	 * Method for executing custom logic for Java
	 * 
	 * @param inputs
	 * @param code
	 * @return String
	 */
	private String javaCustomCode(String inputs, String code) {
		String output = null;
		try {
			LOGGER.info("Custom run code logic running in Java language");
			String className = Pattern.compile(MessageConstants.CLASS_NAME_PATTERN_REGEX).matcher(code).results()
					.map(x -> x.group(1)).findFirst().orElseThrow();
			LOGGER.info("Java Class Name: {}", className);
			Class<?> testClass = InMemoryJavaCompiler.newInstance().useOptions(MessageConstants.COMPILER_OPTION)
					.compile(className, code);
			Method method = testClass.getMethods()[0];
			output = method.invoke(testClass.getConstructor().newInstance(),
					convertParameters(inputs, method.getParameterTypes())).toString();
		} catch (Exception e) {
			LOGGER.error("CustomExecuteCode Java Error", e);
			if (e.getCause() != null)
				output = getSpecificExceptionMessage(e);
			output = e.getMessage();
		}
		return output;
	}

	/**
	 * This method is for convert the String input to method parameters with Java
	 * language
	 * 
	 * @param inputs
	 * @param parameterTypes It used to define the parameter type (ie) input type
	 * @return It returns the actual inputs
	 * @throws CapBusinessException
	 */
	private Object[] convertParameters(String inputs, Class<?>[] parameterTypes) throws CapBusinessException {
		String[] inputArray = inputs.trim().split(MessageConstants.SPACE_SPLIT_REGEX);
		Object[] actualInputs = new Object[parameterTypes.length];
		LOGGER.info("Conversion of parameters Initaited");
		if (inputArray.length != parameterTypes.length)
			throw new CapBusinessException(MessageConstants.PARAMETER_OUT_OF_BOUND_EXCEPTION);
		for (int i = 0; i < parameterTypes.length; i++) {
			if (parameterTypes[i].isArray()) {
				LOGGER.info("Array is found and componentType is {}", parameterTypes[i].componentType());
				if (!inputArray[i].contains("[") || !inputArray[i].contains("]"))
					throw new CapBusinessException(MessageConstants.INVALID_ARRAY_INPUT_EXCEPTION);
				String[] arrayElements = inputArray[i].substring(1, inputArray[i].length() - 1)
						.split(MessageConstants.COMMA_SPLIT_REGEX);
				Object array = Array.newInstance(parameterTypes[i].componentType(), arrayElements.length);
				for (int j = 0; j < arrayElements.length; j++) {
					Array.set(array, j, convertPrimitive(parameterTypes[i].componentType(), arrayElements[j]));
				}
				actualInputs[i] = array;
			} else {
				actualInputs[i] = convertPrimitive(parameterTypes[i], inputArray[i]);
			}
		}
		return actualInputs;
	}

	/**
	 * This method is for convert the String input to primitive data type for java
	 * 
	 * @param type  This is the type of parameter
	 * @param value
	 * @return
	 * @throws CapBusinessException
	 */
	private Object convertPrimitive(Class<?> type, String value) throws CapBusinessException {
		LOGGER.info("Conversion of primitive executing");
		try {
			return switch (type.getCanonicalName()) {
			case "int" -> Integer.parseInt(value);
			case "Integer" -> Integer.parseInt(value);
			case "double" -> Double.parseDouble(value);
			case "Double" -> Double.parseDouble(value);
			case "float" -> Float.parseFloat(value);
			case "Float" -> Float.parseFloat(value);
			case "long" -> Long.parseLong(value);
			case "Long" -> Long.parseLong(value);
			case "boolean" -> Boolean.parseBoolean(value);
			case "Boolean" -> Boolean.parseBoolean(value);
			case "String" -> value;
			default -> throw new CapBusinessException(MessageConstants.UNSUPPORTED_PARAMETER_TYPE + type.getName());
			};
		} catch (NumberFormatException e) {
			if (value == null || value.length() == 0) {
				throw new CapBusinessException(
						MessageConstants.INVALID_INPUT_MESSAGE + MessageConstants.NULL_OR_EMPTY_MESSAGE);
			} else {
				throw new CapBusinessException(MessageConstants.INVALID_INPUT_MESSAGE + value);
			}
		}
	}

	/**
	 * This is the method for executing the custom input given by the user.
	 * 
	 * @param inputs The custom input given by the user
	 * @param code   Code written by the user
	 * @return output Returns output for the custom input given by the user
	 * @throws CapBusinessException
	 */
	@Override
	public String customExecuteCode(String inputs, String code, String language) throws CapBusinessException {
		LOGGER.info("Custom run code logic Initiated");
		String output = null;
		if (MessageConstants.JAVA_LANGUAGE.equalsIgnoreCase(language)) {
			output = javaCustomCode(inputs, code);
		} else if (MessageConstants.PYTHON_LANGUAGE.equalsIgnoreCase(language)) {
			output = pythonCustomCode(inputs, code);
		} else {
			throw new CapBusinessException("Language is not supported");
		}
		LOGGER.info("Custom run code logic Completed");
		return output;
	}

	/**
	 * This is the method for the run code feature, using the question ID of the
	 * dummy test. The case file will run using the JUnit core runner and return as
	 * runResultDto.
	 * 
	 * @param questionId
	 * @param code
	 * @return RunResultDto
	 * @throws CapBusinessException
	 */
	@Override
	public RunResultDto executeCode(int questionId, String code, String language) throws CapBusinessException {
		JUnitCore junit = null;
		Result result = null;
		RunResultDto runResultDto = null;
		try {
			LOGGER.info("Run code logic Initiated with {} language", language);
			CodingQuestion codingQuestion = codingQuestionDao.findById(questionId);
			CodingQuestionFile codingQuestionFile = codingQuestion.getCodingQuestionFiles().stream()
					.filter(file -> file.getLanguage().getLanguageName().equals(language)).findFirst().orElse(null);
			junit = new JUnitCore();
			if (codingQuestionFile != null) {
				Class<?> testClass = CommonUtils.compileAndLoadClass(codingQuestionFile.getDummyClassName(),
						codingQuestionFile.getDummyCaseFile());
				testClass.getField(MessageConstants.SOURCE_CODE).set(testClass.getDeclaredConstructor().newInstance(),
						code);

				result = junit.run(testClass);
				runResultDto = new RunResultDto();
				runResultDto.setTestCount(result.getRunCount());
				runResultDto.setWasSuccessful(result.wasSuccessful());
				runResultDto.setFailureCount(result.getFailureCount());
				runResultDto.setFailureList(result.getFailures().stream().map(Failure::getMessage).toList());

				String specificExceptionMessage = result.getFailures().stream().map(Failure::getException)
						.filter(Objects::nonNull).map(this::getSpecificExceptionMessage).findFirst().orElse(null);

				runResultDto.setException(specificExceptionMessage);
			} else {
				LOGGER.error("Coding question files is not present for the question id = {}", questionId);
			}

		} catch (Exception e) {
			LOGGER.error("Run Code Error", e);
			throw new CapBusinessException(e.getMessage());
		}
		LOGGER.info("Run code logic Completed");
		return runResultDto;
	}

	/**
	 * This method is for throw a specific exception to user while executing run
	 * code feature
	 * 
	 * @param e It is the variable used for saving the exception
	 * @return It will return the exception
	 */
	private String getSpecificExceptionMessage(Throwable e) {
		Throwable cause = e.getCause() != null ? e.getCause() : e;
		return switch (cause.getClass().getSimpleName()) {
		case "ArithmeticException" -> "Arithmetic Exception";
		case "ArrayIndexOutOfBoundsException" -> "Array Index Out Of Bounds Exception";
		case "ClassNotFoundException" -> "Class Not Found Exception";
		case "NullPointerException" -> "Null Pointer Exception";
		case "IllegalArgumentException" -> "Illegal Argument Exception";
		default -> "Other Exception";
		};
	}

	/**
	 * Method for submitting response and evaluation status updating
	 * 
	 * @param attemptId
	 * @return true
	 */
	@Override
	public boolean updateEvaluationStatus(int attemptId) {
		SkillAttempt skillAttempt = skillAttemptDao.findById(attemptId);
		LOGGER.info("Response submitted by {}", skillAttempt.getUser().getUserEmail());
		skillAttempt.setStatus(MessageConstants.STATUS_EVALUATING);
		skillAttemptDao.updateSkillAttempt(skillAttempt);
		return true;
	}

	/**
	 * This is method is used to compile all the user code and store all record into
	 * database
	 * 
	 * @param attemptId
	 * @param codingResponseDtos
	 * @return boolean
	 * @throws CapBusinessException
	 */
	@Override
	public boolean postSubmittedResponse(AttemptResponseDto attemptResponseDto) throws CapBusinessException {

		List<SkillResult> skillResults = new ArrayList<>();
		SkillAttempt skillAttempt = null;
		boolean flag = false;
		try {
			skillAttempt = skillAttemptDao.findById(attemptResponseDto.getAttemptId());
			LOGGER.info("Evaluation started for {}", skillAttempt.getUser().getUserEmail());
			attemptResponseDto.getCodingResponseDtos().stream().forEach(codingResponseDto -> {
				try {
					skillResults.add(calculateResult(codingResponseDto));
				} catch (CapBusinessException e) {
					LOGGER.error("Calculate Result error", e);
				}
			});
			skillAttempt.setSkillResults(skillResults);

			skillAttempt.setTotalScore(Math.round(skillAttempt.getSkillResults().stream().map(SkillResult::getScore)
					.reduce(((score1, score2) -> score1 + score2)).get() / skillAttempt.getSkillResults().size()));

			skillAttempt.setCompletedTime(attemptResponseDto.getCompletedTime());
			skillAttempt.setStartTime(attemptResponseDto.getStartTime());
			skillAttempt.setStatus(MessageConstants.STATUS_COMPLETED);
			skillAttemptDao.updateSkillAttempt(skillAttempt);
			flag = true;

		} catch (Exception e) {
			LOGGER.error("Sumbit Code error", e);
			throw new CapBusinessException(e.getMessage());
		}
		LOGGER.info("Result Published for {}", skillAttempt.getUser().getUserEmail());
		return flag;
	}

	/**
	 * This is a method to generate a individual coding question result and store
	 * into database
	 * 
	 * @param codingResponseDto
	 * @return SkillResult
	 * @throws CapBusinessException
	 */
	private SkillResult calculateResult(CodingResponseDto codingResponseDto) throws CapBusinessException {
		SkillResult skillResult = new SkillResult();

		try {
			CodingQuestion codingQuestion = codingQuestionDao.findById(codingResponseDto.getQuestionId());
			Language language = skillCommonDao.findByLanguageName(codingResponseDto.getLanguage());
			CodingQuestionFile codingQuestionFile = codingQuestion.getCodingQuestionFiles().stream()
					.filter(file -> file.getLanguage().getLanguageName().equals(language.getLanguageName())).findFirst()
					.orElse(null);
			LOGGER.info("Calculating result for {} in Language {}", codingQuestion.getQuestionTitle(),
					codingResponseDto.getLanguage());
			if (codingQuestionFile != null) {
				Class<?> testClass = CommonUtils.compileAndLoadClass(codingQuestionFile.getTestClassName(),
						codingQuestionFile.getTestCaseFile());
				testClass.getDeclaredField(MessageConstants.SOURCE_CODE)
						.set(testClass.getDeclaredConstructor().newInstance(), codingResponseDto.getCode());
				skillResult.setTestResults(codingQuestionDao.findByCodingQuestionFile(codingQuestionFile).stream()
						.map(testCase -> compileCode(testClass, testCase)).toList());
				skillResult.setCodingQuestion(codingQuestion);
				skillResult.setLanguage(language);
				double totalScore = skillResult.getTestResults().stream()
						.map(testResult -> testResult.getStatus().equals(MessageConstants.STATUS_PASS)
								? testResult.getTestCase().getMark()
								: 0)
						.reduce((num1, num2) -> num1 + num2).orElseThrow(null);

				skillResult.setScore(totalScore);
				skillResult.setCode(codingResponseDto.getCode());
			} else {
				LOGGER.error("Error in calculating result");
			}
		} catch (Exception e) {
			LOGGER.error("Calculate Test Result error", e);
			throw new CapBusinessException(e.getMessage());
		}
		return skillResult;
	}

	/**
	 * This is a method to generate a individual test case result and store into
	 * database
	 * 
	 * @param testClass
	 * @param testCase
	 * @return TestResult
	 * @throws CapBusinessException
	 */
	private TestResult compileCode(Class<?> testClass, TestCase testCase) {
		TestResult testResult = new TestResult();
		JUnitCore junit = new JUnitCore();
		Request request = Request.method(testClass, testCase.getTestMethodName());
		Result result = junit.run(request);
		testResult.setRunningTime(result.getRunTime());
		testResult.setFailure(result.getFailures().toString());
		testResult.setStatus(result.wasSuccessful() ? MessageConstants.STATUS_PASS : MessageConstants.STATUS_FAIL);
		testResult.setTestCase(testCase);
		return testResult;
	}

	/**
	 * This is method for fetching the skill attempt record
	 * 
	 * @return SkillAttempt
	 */
	@Override
	public SkillAttempt findById(int attemptId) {
		return skillAttemptDao.findById(attemptId);
	}

	/**
	 * This is the method for taking the all the assessment attempted by a
	 * particular user
	 * 
	 * @return List<SkillAttempt>
	 */
	@Override
	public List<SkillAttempt> findByUserId(int userId) throws CapBusinessException {
		return skillAttemptDao.findByUserId(userId);
	}

}
