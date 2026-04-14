import JSZip from "jszip";

export const validateForm = (data, zipFile, langData) => {
  let errors = {};

  if (!data.questionTitle) {
    errors.questionTitle = "Question title is required";
  } else if (data.questionTitle.length < 10) {
    errors.questionTitle = "Question title must be at least 10 characters";
  }

  if (!data.questionDescription) {
    errors.questionDescription = "Question description is required";
  } else if (data.questionDescription.length < 50) {
    errors.questionDescription =
      "Question description must be at least 50 characters";
  }

  if (!langData.language.languageId) {
    errors.language = "Language is required";
  }

  if (!data.category.categoryId) {
    errors.category = "Category is required";
  }

  if (!data.level) {
    errors.level = "Level is required";
  }

  if (!zipFile) {
    errors.zipFile = "Question zip file is required";
  }

  return errors;
};

export const validateZipFile = async (file) => {
  try {
    const zip = await JSZip.loadAsync(file);
    const files = Object.keys(zip.files);

    const javaFiles = files.filter((file) => file.endsWith(".java")).length;
    const textFiles = files.filter((file) => file.endsWith(".txt")).length;
    const xmlFiles = files.filter((file) => file.endsWith(".xml")).length;
    const nestedZipFiles = files.filter((file) => file.endsWith(".zip")).length;

    if (nestedZipFiles > 0) {
      return {
        isValid: false,
        errorMessage:
          "Multiple ZIP files are not allowed. Please check and re-upload.",
      };
    }

    if (javaFiles >= 2 && xmlFiles >= 1 && textFiles >= 1) {
      const scanForVulnerabilities = async (zipFile, isBinary = false) => {
        const fileContent = isBinary
          ? await zipFile.async("uint8array")
          : await zipFile.async("text");

        if (!isBinary) {
          const vulnerabilityPatterns = ["System.exit", "<!ENTITY", "rm -rf"];
          const hasTextVulnerabilities = vulnerabilityPatterns.some((pattern) =>
            fileContent.includes(pattern)
          );
          if (hasTextVulnerabilities) return true;
        } else {
          const executableSignatures = [
            {
              signature: [0x4d, 0x5a],
              description: "Executable file (MZ header)",
            },
          ];
          for (let i = 0; i < executableSignatures.length; i++) {
            const { signature, description } = executableSignatures[i];
            if (
              fileContent.slice(0, signature.length).toString() ===
              new Uint8Array(signature).toString()
            ) {
              console.warn(
                `Warning: Detected ${description} in ${zipFile.name}`
              );
              return true;
            }
          }
        }

        return false;
      };

      for (const filename of files) {
        const zipFile = zip.files[filename];
        const isVulnerable = await scanForVulnerabilities(
          zipFile,
          filename.endsWith(".bin")
        );

        if (isVulnerable) {
          return {
            isValid: false,
            errorMessage: `The file contains vulnerable risk content. Please check and re-upload.`,
          };
        }
      }

      return { isValid: true, errorMessage: "" };
    } else {
      let missingFilesMessage = "Required files are missing:";
      if (javaFiles < 2) missingFilesMessage += " at least 2 .java files";
      if (xmlFiles < 1) missingFilesMessage += " at least 1 .xml file";
      if (textFiles < 1) missingFilesMessage += " at least 1 .txt file";
      return {
        isValid: false,
        errorMessage: missingFilesMessage,
      };
    }
  } catch (error) {
    console.error("Error reading the ZIP file:", error);
    return {
      isValid: false,
      errorMessage:
        "You are trying to upload different files. Check file format.",
    };
  }
};
