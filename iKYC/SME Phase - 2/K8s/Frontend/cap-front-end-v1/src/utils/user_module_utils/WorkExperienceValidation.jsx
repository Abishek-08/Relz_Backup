export const validateCompanyName = (companyName) => {
     if (companyName.length > 50) {
       return "Company name must be maximum 50 characters";
     }
     return null;
   };
   
   export const validateRole = (role) => {
     const regex = /^[A-Za-z. -]+$/;
     if (!regex.test(role)) {
       return "Role can only contain alphabets, dot (.) and dash (-)";
     }
     return null;
   };
   
   export const validateLocation = (location) => {
     const regex = /^[A-Z a-z]+$/;
     if (!regex.test(location)) {
       return "Location can only contain alphabets";
     }
     return null;
   };
   
   export const validateFromYear = (fromYear, toYear) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
  
    const fromYearDate = new Date(fromYear);
    const toYearDate = new Date(toYear);
  
    if (fromYear !== "Present") {
      if (fromYearDate > currentDate) {
        return "From year must be in the past";
      }
      if (fromYear >= toYear) {
        return "From year must be earlier than To year";
      }
    }
  
    if (toYear !== "Present") {
      
      if (toYearDate > currentDate) {
        return "To year must be in the past";
      }

      if (toYearDate.getFullYear() === currentYear && toYearDate.getMonth() + 1 > currentMonth) {
        return "To year must be in the past relative to the current month";
      }
    }
  
    return null;
  };
  
   