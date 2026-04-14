// Special characters for validation
const specialChars = " !@#$%^&*()_+~`-=[]{},.|\\:;\"'<>";

// Function to validate question content
export const validateQuestionContent = (content) => {
  const hasQuestionMinLength = content.length >= 4;

  if (specialChars.includes(content[0]) || !hasQuestionMinLength) {
    return "Please Enter Right Question Format!";
  }

  if (content.length > 300) {
    return "Content should be 300 characters";
  }

  return null; // No validation errors
};

// Function to validate MSQ options
export const validateMSQOptions = (answers) => {
  const selectedAnswers = answers.filter(
    (answer) => answer.correctAnswer === 1
  );

  if (selectedAnswers.length < 2) {
    return "Please select at least 2 correct answers for MSQ";
  } else if (selectedAnswers.length > 3) {
    return "You can only select up to 3 correct answers for MSQ";
  }

  return null; // No validation errors
};

// Function to check for duplicate options
export const checkForDuplicateOptions = (answers) => {
  const optionContents = answers.map((answer) =>
    answer.optionContent.trim().toLowerCase()
  );
  const hasDuplicates = new Set(optionContents).size !== optionContents.length;

  if (hasDuplicates) {
    return "Duplicate options are not allowed. Please ensure all options are unique.";
  }

  return null; // No validation errors
};
