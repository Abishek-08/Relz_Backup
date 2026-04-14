export const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,15}$/;
  return regex.test(password);
};




export const validatePasswordUpdatePassword = (password) => {
  // Regular expression for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,14}$/;

  // Check if password matches the regex
  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message:
        "New password must contain at least one special character, one capital, one small, one number, and 10 to 14 characters long.",
    };
  }

  // Password is valid
  return {
    isValid: true,
    message: "",
  };
};
