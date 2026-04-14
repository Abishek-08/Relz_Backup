export const validateUserName = (userName) => {
    if (!/^[a-zA-Z ]*$/.test(userName)) {
      return "Please enter a valid username with alphabetic characters only.";
    }
    return null;
  };
 
  export const validateUserMobile = (userMobile) => {
    if (!/^\d{10}$/.test(userMobile)) {
      return "Please enter a valid mobile number with 10 digits.";
    }
    if (/^0/.test(userMobile)) {
      return "Mobile number should not start with 0.";
    }
    return null;
  };
 
  export const validateUserEmail = (userEmail) => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail)) {
      return "Please enter a valid email address.";
    }
    return null;
  };