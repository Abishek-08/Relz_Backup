// ValidateFeedbackForm.jsx

export const validateFeedback = (feedback) => {
    if (!feedback.trim()) {
      return 'Feedback cannot be empty.';
    }
    if (feedback.length < 10) {
      return 'Feedback should be at least 10 characters long.';
    }
    if (feedback.length > 300) {
      return 'Feedback should not exceed 300 characters.';
    }
    return null; 
  };
  