// EducationFormValidator.js

export const validateEducationForm = (educationData) => {
  const errors = {};
  console.log("Education Datas");
  console.log(educationData);

  // Institute Name validation
  if (!educationData.instituteName || educationData.instituteName.length < 1) {
    errors.instituteName =
      "Institute name must be at least 10 characters long.";
  } else if (!/^[a-zA-Z.\- ]+$/.test(educationData.instituteName)) {
    errors.instituteName = "Institute name can only contain letters, spaces,-.";
  }

  // From Year validation
  const currentYear = new Date().getFullYear();
  const fromDuration = parseInt(educationData.fromDuration, 10);
  const toDuration = parseInt(educationData.toDuration, 10);

  // Check if fromDuration is not in the future
  if (fromDuration >= currentYear) {
    errors.fromDuration = "From year must be in the past.";
  }

  // Check if fromDuration is greater than toDuration
  if (fromDuration > toDuration) {
    errors.fromDuration = "To Duration must be greater than From Duration.";
  }

  // Check if the difference between toDuration and fromDuration is less than 2 years
  if (
    (educationData.degree === "BA" || educationData.degree === "BSC") &&
    toDuration - fromDuration < 3
  ) {
    errors.fromDuration = "The duration must be at least 3 years.";
  }

  if (
    (educationData.degree === "BE" || educationData.degree === "B.Tech") &&
    toDuration - fromDuration < 4
  ) {
    errors.fromDuration = "The duration must be at least 4 years.";
  }

  if (
    (educationData.degree === "ME" || educationData.degree === "M.Tech") &&
    toDuration - fromDuration < 2
  ) {
    errors.fromDuration = "The duration must be at least 2 years.";
  }

  // Output errors if any
  console.log(errors);

  // CGPA validation
  if (educationData.cgpa <= 4.9 || educationData.cgpa >= 10) {
    errors.cgpa = "CGPA must be greater than 5 and less than 10.";
  }

  if (!educationData.degree) {
    errors.degree = "Degree is required.";
  }

  if (educationData.degree !== "Other" && !educationData.stream) {
    errors.stream = "Stream is required.";
  }

  if (!educationData.instituteName) {
    errors.instituteName = "Institute Name is required.";
  }

  if (educationData.cgpa <= 0 || educationData.cgpa > 10) {
    errors.cgpa = "CGPA must be between 0 and 10.";
  }

  if (
    educationData.fromDuration >= educationData.toDuration ||
    !educationData.fromDuration ||
    !educationData.toDuration
  ) {
    errors.durations = "Please select valid From and To years.";
  }

  // Custom duration validation based on degree
  const degreeDurationLimits = {
    BE: 4,
    BTech: 4,
    BA: 3,
    BSC: 3,
    ME: 2,
    MTech: 2,
  };

  const maxDuration = degreeDurationLimits[educationData.degree];

  if (maxDuration && (educationData.toDuration - educationData.fromDuration > maxDuration)) {
    errors.duration = `Duration Not More than ${maxDuration} years.`;
  }


  return errors;
};
