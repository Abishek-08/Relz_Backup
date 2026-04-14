package com.rts.cap.service;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.rts.cap.exception.CapBusinessException;
import com.rts.cap.model.Category;
import com.rts.cap.model.CodingQuestion;
import com.rts.cap.model.Language;

@SpringBootTest
@TestMethodOrder(OrderAnnotation.class)
class CodingQuestionServiceTest {

	@Autowired
	CodingQuestionService codingQuestionService;

	@Autowired
	LanguageService languageService;

	@Autowired
	SkillCommonService skillCommonService;

	/**
	 * @author srinivasan.su
	 * @since 15-07-2024
	 */

	@Disabled("Integration Purpose")
	@Test
	@Order(1)
	void testFindAllCodingQuestions() {
		assertNotNull(codingQuestionService.findAllCodingQuestion());
	}

	/**
	 * @author srinivasan.su
	 * @since 15-07-2024
	 */

	@Test
	@Order(2)
	@Disabled("Integration Purpose")
	void testgetQuestionDetail() {
		assertNotNull(codingQuestionService.findCodingQuestionById(1));
	}

	/**
	 * @author srinivasan.su
	 * @since 15-07-2024
	 */
	@Disabled("Integration Purpose")
	@Test
	@Order(3)
	void testDeleteQuestion() {
		assertTrue(codingQuestionService.deleteCodingQuestion(68));
	}

	/**
	 * @author srinivasan.su
	 * @since 15-07-2024
	 */
	@Disabled("Integration Purpose")
	@Test
	@Order(4)
	void testUpdateCodingQuestion() {
		CodingQuestion codingQuestion = new CodingQuestion();
		codingQuestion.setQuestionId(64);
		codingQuestion.setQuestionTitle("Reverse String for testing purpose");
		codingQuestion.setQuestionDescription(
				"<p>only for test assertArray EqualsassertArrayEqualsassertArrayEqualsassertArrayEquals</p>");
		codingQuestionService.updateCodingQuestion(codingQuestion);
		String title = codingQuestion.getQuestionTitle();
		String description = codingQuestion.getQuestionDescription();

		assertNotNull(codingQuestion);
		assertEquals("Reverse String for testing purpose", title);
		assertEquals("<p>only for test assertArray EqualsassertArrayEqualsassertArrayEqualsassertArrayEquals</p>",
				description);
	}

	@Disabled("Integration Purpose")
	@ParameterizedTest
	@ValueSource(strings = { "C", "C++", "C#" })
	@Order(5)
	void testAddLanguage(String languageName) {
		Language language = new Language();
		language.setLanguageName(languageName);
		try {
			assertEquals(true, languageService.addLanguage(language));
		} catch (CapBusinessException e) {
			e.printStackTrace();
		}
	}

	@Disabled("Integration Purpose")
	@Test
	@Order(6)
	void testFindAllLanguage() {
		assertNotNull(languageService.findAllLanguage());
	}

	@Disabled("Integration Purpose")
	@ParameterizedTest
	@CsvSource({ "1,'List'", "2,'Queue'", "3,'ArrayList'" })
	@Order(7)
	void testAddCategory(String categoryName) {
		Category category = new Category();
		category.setCategoryName(categoryName);
		try {
			assertEquals(true, skillCommonService.addCategory(category));
		} catch (CapBusinessException e) {
			e.printStackTrace();
		}
	}

	/**
	 * @author srinivasan.su
	 * @since 23-08-2024
	 */
	@Disabled("Integration Purpose")
	@Test
	@Order(8)
	void testFindByCategoryId() {
		int categoryId = 1;
		assertNotNull(skillCommonService.findById(categoryId));
	}

	@Disabled("Integration Purpose")
	@Test
	@Order(9)
	void testFilterByAll() {
		int categoryId = 1;
		String level = "easy";
		List<CodingQuestion> result = codingQuestionService.filterByAll(categoryId, level);
		assertNotNull(result);
	}

	@Disabled("Integration Purpose")
	@Test
	@Order(10)
	void testFilterByAllCount() {
		int categoryId = 1;
		String level = "easy";
		int count = codingQuestionService.filterByAllCount(categoryId, level);
		assertTrue(count >= 0);
	}

	@Disabled("Integration Purpose")
	@Test
	@Order(11)
	void testFilterByCategoryCount() {
		int categoryId = 1;
		int count = codingQuestionService.filterByCategoryCount(categoryId);
		assertTrue(count >= 0);
	}

}
