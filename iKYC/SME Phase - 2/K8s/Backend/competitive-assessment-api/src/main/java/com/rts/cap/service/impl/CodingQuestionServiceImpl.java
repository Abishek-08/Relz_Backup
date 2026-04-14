package com.rts.cap.service.impl;
 
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dao.CodingQuestionDao;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.CodingQuestion;
import com.rts.cap.model.CodingQuestionFile;
import com.rts.cap.model.Language;
import com.rts.cap.model.TestCases;
import com.rts.cap.service.CodingQuestionService;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;
import lombok.RequiredArgsConstructor;
 
/**
* @author sanjay.subramani , dharshsun.s, prem.mariyappan, srinivasan.su
* @since 27-06-2024
* @version 1.0
*/
 
/**
* @author srinivasan.su
* @since 02-09-2024
* @version 2.0
*/
 
@Transactional
@Service
@RequiredArgsConstructor
public class CodingQuestionServiceImpl implements CodingQuestionService {
 
	private final CodingQuestionDao codingQuestionDao;
 
	private static final Logger LOGGER = LogManager.getLogger(CodingQuestionServiceImpl.class);
 
	/**
	 * This is the method which is used for coding questions uploading business
	 * logic.
	 *
	 * @param question
	 * @param languages
	 * @param fileDtos
	 * @throws CapBusinessException
	 */
	@Override
	public boolean uploadCodingQuestion(String question, String languages, MultipartFile[] files)
			throws CapBusinessException {
		LOGGER.info("Uploading Logic Initiated...");
		CodingQuestion codingQuestion = stringToObject(question);
		List<Language> languageList = stringToListOfLanguage(languages);
		List<CodingQuestionFile> codingQuestionFiles = new ArrayList<>();
		boolean isSuccess = false;
		try {
			//IntStream generates a stream of indices from 0 to languageList.size() - 1
			IntStream.range(0, languageList.size()).forEach(index ->{
				Language lang = languageList.get(index);
				MultipartFile file = files[index];
				CodingQuestionFile codingQuestionFile = null;
				try {
					codingQuestionFile = processFile(file);
				} catch (IOException e) {
					LOGGER.error("Error occurred while uploading coding question:", e);
				}
				codingQuestionFile.setLanguage(lang);
				codingQuestionFiles.add(codingQuestionFile);
			});
			codingQuestion.setCodingQuestionFiles(codingQuestionFiles);
			codingQuestionDao.uploadCodingQuestion(codingQuestion);
			isSuccess = true;
		} catch (Exception e) {
			LOGGER.error("Error occurred while uploading coding question: {}", e.getMessage(), e);
			throw new CapBusinessException("Error occurred while uploading coding question" + e);
		}
 
		return isSuccess;
	}
/**
	 * This is the helper method to process all type of files based on the extension
	 *
	 * @param file
	 * @return CodingQuestionFile
	 * @throws IOException
	 */
	private CodingQuestionFile processFile(MultipartFile file) throws IOException {
		CodingQuestionFile codingQuestionFile = new CodingQuestionFile();
		Map<String, byte[]> fileContentMap = unZippingFile(file);
 
		fileContentMap.entrySet().stream().forEach(entry -> {
			String fileName = entry.getKey();
			byte[] content = entry.getValue();
			String extension = fileName.substring(fileName.lastIndexOf("."));
 
			switch (extension) {
			case MessageConstants.XML_EXTENSION:
				codingQuestionFile.setTestCaseXml(new String(xmlToTestCase(content, codingQuestionFile)));
				break;
			case MessageConstants.JAVA_FILE_EXTENSION:
				handleJavaFile(codingQuestionFile, fileName, content);
				break;
			default:
				codingQuestionFile.setCodeSkeleton(new String(content));
				break;
			}
		});
 
		return codingQuestionFile;
	}
 
	/**
	 * This is the helper method to process all the test case files
	 * 
	 * @param codingQuestionFile
	 * @param fileName
	 * @param content
	 */
	private void handleJavaFile(CodingQuestionFile codingQuestionFile, String fileName, byte[] content) {
		boolean isDummyFile = fileName.contains(MessageConstants.DUMMY_FILE_EXTENSION);
		String contentStr = new String(content);
		String className = fileName.substring(0, fileName.lastIndexOf("."));
 
		if (isDummyFile) {
			codingQuestionFile.setDummyCaseFile(contentStr);
			codingQuestionFile.setDummyClassName(className);
		} else {
			codingQuestionFile.setTestCaseFile(contentStr);
			codingQuestionFile.setTestClassName(className);
		}
	}
 
	/**
	 * This is Method for Converting String to List of Language
	 * 
	 * @param language
	 * @return List<Language>
	 */
	private List<Language> stringToListOfLanguage(String language) {
		ObjectMapper objectMapper = new ObjectMapper();
		List<Language> list = null;
		try {
			list = objectMapper.readValue(language, new TypeReference<List<Language>>() {
			});
		} catch (Exception e) {
			LOGGER.error("String to List Conversion error", e);
		}
 
		return list;
	}
 
	/**
	 * This is the method which UnZipping file business logic occur.
	 *
	 * @param zipFile
	 * @return {@link HashMap} if error occurs throws CustomException
	 * @throws CapBusinessException
	 */
	private Map<String, byte[]> unZippingFile(MultipartFile ziFile) {
		Map<String, byte[]> map = new HashMap<>();
		try {
			ZipInputStream zipInputStream = new ZipInputStream(new ByteArrayInputStream(ziFile.getBytes()));
			ZipEntry entry;
			while ((entry = zipInputStream.getNextEntry()) != null) {
				byte[] entryContent = zipInputStream.readAllBytes();
				map.put(entry.getName().substring(entry.getName().indexOf("/") + 1), entryContent);
				zipInputStream.closeEntry();
			}
			zipInputStream.close();
		} catch (IOException e) {
			LOGGER.error("UnZipping File error", e);
		}
		return map;
	}
 
	/**
	 * This is the method which used for xml to Pojo's business logic.
	 *
	 * @param xmlFile
	 * @param codingQuestion
	 * @return byte[]
	 * @throws CapBusinessException
	 */
	private byte[] xmlToTestCase(byte[] xmlFile, CodingQuestionFile codingQuestionFile) {
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(TestCases.class);
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			TestCases testCases = (TestCases) jaxbUnmarshaller.unmarshal(new StringReader(new String(xmlFile)));
			testCases.getTestCaseList().stream().forEach(testCase -> {
				testCase.setCodingQuestionFile(codingQuestionFile);
				codingQuestionDao.uploadTestCase(testCase);
			});
		} catch (Exception e) {
			LOGGER.error("Xml Conversion error", e);
		}
		return xmlFile;
	}
 
	/**
	 * This is the method which used for convert String to Coding Question Object
	 * business logic.
	 *
	 * @param question Using the {@link com.fasterxml.jackson.databind.ObjectMapper}
	 *                 convert the string data into Coding Question Object
	 * @return Coding Question Object
	 * @throws CapBusinessException
	 */
	private CodingQuestion stringToObject(String question) {
		ObjectMapper objectMapper = new ObjectMapper();
		CodingQuestion codingQuestion = null;
		try {
			codingQuestion = objectMapper.readValue(question, CodingQuestion.class);
		} catch (Exception e) {
			LOGGER.error("String to Object Conversion error", e);
		}
 
		return codingQuestion;
 
	}
 
	/**
	 * This is the method which used for retrieving all the Coding Q business logic.
	 * 
	 * @return List<CodingQuestion>
	 */
	@Override
	public List<CodingQuestion> findAllCodingQuestion() {
		return codingQuestionDao.findAllCodingQuestion();
	}
/**
	 * Method for Updating the Title and Description of coding question based on
	 * questionId Returning boolean value true if updated or else false Getting all
	 * the attributes of Coding question
	 */
	@Override
	public boolean updateCodingQuestion(CodingQuestion codingQuestion) {
		boolean flag = false;
		try {
			CodingQuestion existingQuestion = codingQuestionDao.findById(codingQuestion.getQuestionId());
			if (existingQuestion != null) {
				existingQuestion.setQuestionTitle(codingQuestion.getQuestionTitle());
				existingQuestion.setQuestionDescription(codingQuestion.getQuestionDescription());
				codingQuestionDao.updateCodingQuestion(existingQuestion);
			}
			flag = true;
		} catch (Exception e) {
			LOGGER.error("Update Coding Question error", e);
		}
		return flag;
	}
 
	/**
	 * Method for deleting a coding question which is also associated with a list of
	 * testcases.
	 *
	 * @param questionId The ID of the coding question to delete.
	 * @return true if the coding question and its associated test cases were
	 *         successfully deleted, otherwise false.
	 */
	@Override
	public boolean deleteCodingQuestion(int questionId) {
		boolean flag = false;
		try {
			CodingQuestion codingQuestion = codingQuestionDao.findById(questionId);
			if (codingQuestion != null) {
				List<CodingQuestionFile> codingQuestionFiles = codingQuestion.getCodingQuestionFiles();
				codingQuestionDao.deleteCodingQuestion(codingQuestion);
				codingQuestionFiles.stream().forEach(file -> {
					codingQuestionDao.findByCodingQuestionFile(file).stream()
							.forEach(codingQuestionDao::deleteTestCase);
					codingQuestionDao.removeCodingQuestionFile(file);
				});
 
				flag = true;
			}
		} catch (Exception e) {
			LOGGER.error("Delete Coding Question error", e);
		}
		return flag;
	}
 
	/**
	 * Method for filter list coding question with respect to category, level.
	 *
	 * @param categoryId
	 * @param level
	 * @return List<CodingQuestion>
	 */
	@Override
	public List<CodingQuestion> filterByAll(int categoryId, String level) {
		return codingQuestionDao.filterByAll(categoryId, level);
	}
 
	/**
	 * Method for returning the total number of coding questions based on
	 * categoryId,level
	 */
	@Override
	public int filterByAllCount(int categoryId, String level) {
		return codingQuestionDao.filterByAllCount(categoryId, level);
	}
 
	/**
	 * Method for filter list coding question with respect to category.
	 * 
	 * @param categoryId
	 * @return List<CodingQuestion>
	 */
	@Override
	public List<CodingQuestion> filterByCategory(int categoryId) {
		return codingQuestionDao.filterByCategory(categoryId);
	}
 
	/**
	 * This method is to get the count based on category
	 * 
	 * @param categoryId
	 * @param level
	 */
	@Override
	public int filterByCategoryCount(int categoryId) {
		return codingQuestionDao.filterByCategoryCount(categoryId);
	}
 
	/**
	 * Method for retrieving the Coding Question by question Id
	 * 
	 * @param questionId
	 * @return CodingQuestion
	 */
	@Override
	public CodingQuestion findCodingQuestionById(int questionId) {
		return codingQuestionDao.findById(questionId);
	}
 
}
