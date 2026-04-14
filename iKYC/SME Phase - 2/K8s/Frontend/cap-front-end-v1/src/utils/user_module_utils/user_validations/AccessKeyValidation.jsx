export const validateAccessKey = (value) => {
    const re = /^(?=.*[a-zA-Z\d@.+<>#$!%*?&])[A-Za-z\d@.+<>#$!%*?&]{6}$/;
    return re.test(value);
  };
  