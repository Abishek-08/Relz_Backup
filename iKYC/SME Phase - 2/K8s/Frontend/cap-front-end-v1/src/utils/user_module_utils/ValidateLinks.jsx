// LinkAndSkillValidator.js

export const ValidateLinks = (linksData) => {
     const errors = {};
   
     // Validate GitHub link
     if (linksData.gitHubLink && !isValidUrl(linksData.gitHubLink)) {
       errors.gitHubLink = "Please enter a valid GitHub link";
     }
   
     // Validate LinkedIn link
     if (linksData.linkedIn && !isValidUrl(linksData.linkedIn)) {
       errors.linkedIn = "Please enter a valid LinkedIn profile link";
     }
   
     // Validate Portfolio link
     if (linksData.portfolio && !isValidUrl(linksData.portfolio)) {
       errors.portfolio = "Please enter a valid Portfolio link";
     }
   
     return errors;
   };
   
   const isValidUrl = (url) => {
     // Basic URL validation regex
     const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
     return urlRegex.test(url);
   };
   