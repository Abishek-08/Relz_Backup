/*
 * @aurthor: sundhar raj s - 12106
 * @since: 01-07-2024
 * @version: 1.0
 * @purpose: email validations
 * @params :  email
 */
export const emailValidations = (email) => {
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/.test(email)) {
    return true;
  }
  return false;
};

/*
 * @aurthor: sundhar raj s - 12106
 * @since: 01-07-2024
 * @version: 1.0
 * @purpose: password validations
 * @params :  password
 */
