/*
 * @aurthor: sundhar raj s - 12106
 * @since: 01-07-2024
 * @version: 1.0
 * @purpose: otp validations
 * @params :  otp
 */

export const otpValidation = (otp) => {
  if (/^\d{1,6}$/gm.test(otp)) {
    return true;
  }

  return false;
};
