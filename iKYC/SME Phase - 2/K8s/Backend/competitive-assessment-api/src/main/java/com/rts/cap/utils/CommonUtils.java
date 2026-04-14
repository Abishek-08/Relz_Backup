package com.rts.cap.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.mdkt.compiler.InMemoryJavaCompiler;

import com.rts.cap.constants.MessageConstants;
import com.rts.cap.dto.RowUploadStatusDto;

public class CommonUtils {

	static Random random = new Random();
    
	//In order to prevent erroneous complexity types, knowledge-based assessments should use static question complexity levels. 
	public static final Set<String> VALID_COMPLEXITIES = new HashSet<>(Arrays.asList("Basic", "Intermediate", "Hard"));
	
	//Util method for cell value change into String type  
	public static String getStringCellValue(Row row, int columnIndex) {
        Cell cell = row.getCell(columnIndex);
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return DateUtil.isCellDateFormatted(cell) ? cell.getDateCellValue().toString() : String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return Boolean.toString(cell.getBooleanCellValue());
            case BLANK:
            default:
                return "";
        }
    }
	
	//Util method for cell value change into String type  
	public static String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return DateUtil.isCellDateFormatted(cell) ? cell.getDateCellValue().toString() : String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return Boolean.toString(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
	

	public static void skipHeaderRow(Iterator<Row> rowIterator) {
        if (rowIterator.hasNext()) {
            rowIterator.next(); // Skip header row
        }
    }
	
	// This method for to change string value to Integer
	public static int parseMark(String markString) {
        try {
            return Integer.parseInt(markString);
        } catch (NumberFormatException e) {
            return -1;
        }
    }
	
	//Check all the option whether it's empty or not if it's empty skip that value then collect into single List
	public static List<String> getOptionContents(Row row) {
        return CommonUtils.getCellStreamRange(MessageConstants.OPTION_START_COLUMN, MessageConstants.CORRECT_OPTION_COLUMN, row)
                .map(CommonUtils::getCellValueAsString)
                .filter(content -> !content.isEmpty())
                .toList();
    }
	
	//To split the Correct option cell value using 'comma' as a delimiter then change into String array 
	 public static String[] getCorrectOptions(Row row) {
	        String correctOptionsString = CommonUtils.getStringCellValue(row, MessageConstants.CORRECT_OPTION_COLUMN);
	        return Arrays.stream(correctOptionsString.split(","))
	                .map(String::trim)
	                .toArray(String[]::new);
	 }
	
	 
	public static Stream<Cell> getCellStreamRange(int startInclusive, int endExclusive, Row row) {
        return IntStream.range(startInclusive, endExclusive)
                .mapToObj(row::getCell)
                .filter(cell -> cell != null && (cell.getCellType() == CellType.STRING || cell.getCellType() == CellType.NUMERIC || cell.getCellType() == CellType.BOOLEAN));
    }
	
	
	//To consider the last row of the spreadsheet
	public static boolean isEndOfFile(Row row) {
        Cell firstCell = row.getCell(MessageConstants.END_OF_LINE);
        return firstCell != null && MessageConstants.END_OF_QUESTION_XL_FILE.equalsIgnoreCase(firstCell.getStringCellValue().trim());
    }
	
	/**
	 * To check whether complexity is valid or not. 
	 *
	 * @param complexity
	 * @return Skipped reason or Optional.empty
	 */ 
	 public static Optional<RowUploadStatusDto>validateComplexity(String complexity){
    	 if (complexity.isEmpty()) {
             return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.COMPLEXITY_REASON));
         } else if (!CommonUtils.VALID_COMPLEXITIES.contains(complexity)) {
             return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.COMPLEXITY_INVALID_REASON));
         }
    	 return Optional.empty();
    }
     
	 /**
		 * To check whether Question Type is valid or not. 
		 *
		 * @param questionType
		 * @return Skipped reason or Optional.empty
		 */ 
	 public static Optional<RowUploadStatusDto> validateQuestionType(String questionType) {
	        if (!"SSQ".equalsIgnoreCase(questionType) && !"MSQ".equalsIgnoreCase(questionType)) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.QUESTION_TYPE_MISMATCH_REASON));
	        }
	        return Optional.empty();
	   }
	 
	 /**
		 * To check whether the Mark is valid or not. 
		 *
		 * @param mark
		 * @return Skipped reason or Optional.empty
		 */ 
	  public static Optional<RowUploadStatusDto> validateMark(int mark) {
	        if (mark <= 0 || mark > 30) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.MARK_REASON));
	        }
	        return Optional.empty();
	    }
	  
	  /**
		 * To check whether Option is valid or not. 
		 *
		 * @param List<String> optionContents
		 * @return Skipped reason or Optional.empty
		 */ 
	  public static Optional<RowUploadStatusDto> validateOptions(List<String> optionContents) {
	        if (optionContents.size() < 2 || optionContents.isEmpty()) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.OPTION_REASON));
	        }
	        Set<String> uniqueOptions = new HashSet<>(optionContents);
	        if (uniqueOptions.size() < optionContents.size()) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.OPTION_DUPLICATE_REASON));
	        }
	        return Optional.empty();
	    }

	  /**
		 * To check whether correct option is valid or not. 
		 *
		 * @param String[] correctOptions
		 * @param List<
		 * @return Skipped reason or Optional.empty
		 */ 
	  public static Optional<RowUploadStatusDto> validateCorrectOptions(String[] correctOptions, List<String> optionContents) {
	        Set<String> optionContentsSet = new HashSet<>(optionContents);
	        Set<String> uniqueCorrectOptions = new HashSet<>(Arrays.asList(correctOptions));
			 if (correctOptions.length > MessageConstants.MAX_CORRECT_OPTIONS) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.CORRECT_OPTION_EXCEEDS_LIMIT_REASON));
	        }
	        if (uniqueCorrectOptions.size() < correctOptions.length) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.CORRECT_OPTION_DUPLICATE_REASON));
	        }
	        if (correctOptions.length == 0 || !optionContentsSet.containsAll(Arrays.asList(correctOptions))) {
	            return Optional.of(new RowUploadStatusDto(MessageConstants.SKIPPED_ROW, MessageConstants.CORRECT_OPTION_NOT_FOUND_REASON));
	        }
	        return Optional.empty();
	    }
	  
	// Get current date and calculate the date range for the last three months
	public static final LocalDate today = LocalDate.now();
	public static final LocalDate startOfThreeMonthsAgo = today.minusMonths(3)
			.with(TemporalAdjusters.firstDayOfMonth());
	public static final LocalDate endOfLastMonth = today.with(TemporalAdjusters.lastDayOfMonth());

	// Skill Assessment Compilation ClassPaths and ClassLoader
	private static ClassLoader classLoader = org.springframework.util.ClassUtils.getDefaultClassLoader();

	private CommonUtils() {
		super();
	}

	/**
	 * This "randomTemporaryPassword" method is used to generate the random password
	 * generator. To give random password to user while registering the user.
	 * 
	 * @return
	 */
	public static String randomTemporaryPassword(int length) {

		String capitalCaseLetters = MessageConstants.CAPITAL_CASE_LETTERS;
		String lowerCaseLetters = MessageConstants.LOWER_CASE_LETTERS;
		String specialCharacters = MessageConstants.SPECIAL_CHARACTERS;
		String numbers = MessageConstants.NUMBERES;
		String combinedChars = capitalCaseLetters + lowerCaseLetters + specialCharacters + numbers;

		char[] password = new char[length];
		password[0] = lowerCaseLetters.charAt(random.nextInt(lowerCaseLetters.length()));
		password[1] = capitalCaseLetters.charAt(random.nextInt(capitalCaseLetters.length()));
		password[2] = specialCharacters.charAt(random.nextInt(specialCharacters.length()));
		password[3] = numbers.charAt(random.nextInt(numbers.length()));
		for (int i = 4; i < length; i++) {
			password[i] = combinedChars.charAt(random.nextInt(combinedChars.length()));
		}
		return new String(password);

	}

	/**
	 * Method for converting byte[] to String
	 * 
	 * @param byteArray
	 * @return String
	 */
	public static String byteArrayToString(byte[] byteArray) {
		return new String(byteArray);
	}

	/**
	 * Method for getting the current date in the string of (MM/dd/yyyy)
	 * 
	 * @return String
	 */

	public static String currentDateString() {

		return LocalDateTime.now().format(DateTimeFormatter.ofPattern("MM/dd/yyyy"));
	}

	public static DateTimeFormatter dateFormatter() {

		return DateTimeFormatter.ofPattern("MM/dd/yyyy");
	}

	/**
	 * Method for Compiling the test unit files with InMemoryJavaCompiler
	 * 
	 * @param className
	 * @param classCode
	 * @return Compiled Class
	 * @throws Exception
	 */
	public static Class<?> compileAndLoadClass(String className, String classCode) throws Exception {
		return InMemoryJavaCompiler.newInstance().useOptions("-parameters", "-classpath",
				MessageConstants.JUNITJARPATH + MessageConstants.SEMI_COLON_SYMBOL 
				+ MessageConstants.HAMCRESTJARPATH + MessageConstants.SEMI_COLON_SYMBOL 
				+ MessageConstants.COMPILERJARPATH+ MessageConstants.SEMI_COLON_SYMBOL  
				+ MessageConstants.JYTHONJARPATH,
				"-Xlint:unchecked", "-proc:none").useParentClassLoader(classLoader).compile(className, classCode);
	}

}
