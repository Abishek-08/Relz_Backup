 // src/utils/validation.js

export const validateCertificationData = (data) => {
    let valid = true;
    const errors = {
      verificationId: "",
      issueDate: "",
      institutionName: "",
      certificateName: "",
      certificateImage: "",
    };
  
    if (!data.verificationId) {
      errors.verificationId = "Certificate Verification ID is required";
      valid = false;
    }
  
    if (!data.issueDate) {
      errors.issueDate = "Issue Date is required";
      valid = false;
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(data.issueDate);
      if (selectedDate > currentDate) {
        errors.issueDate = "Issue Date cannot be in the future";
        valid = false;
      }
    }
  
    if (!data.institutionName) {
      errors.institutionName = "Certification Provider Name is required";
      valid = false;
    }
  
    if (!data.certificateName) {
      errors.certificateName = "Certificate Name is required";
      valid = false;
    }
  
    if (!data.certificateImage) {
      errors.certificateImage = "Certificate Image is required";
      valid = false;
    }
  
    return { valid, errors };
  };
  
  