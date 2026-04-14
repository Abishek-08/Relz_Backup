
/**
 * @author Sb Abishek
 * @since 12-08-2024
 * @version 1.0
 */
export const validatePasswordCriteria = (password) => {
    return {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@#$%^&*!]/.test(password),
      isLongEnough: password.length >= 10,
    };
  };
  
  export const validatePasswordsMatch = (newPassword, confirmPassword) => {
    return newPassword === confirmPassword;
  };
  
  export const validateOldAndNewPassword = (oldPassword, newPassword) => {
    return oldPassword !== newPassword;
  };
  