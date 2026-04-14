import * as XLSX from "xlsx";

/**
 * @author prasanth.baskaran
 * @since 31-07-2024
 * @version 5.0
 */
// Utility function to get the number of rows in the selected file up to a specific condition
const GetNumberOfRows = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Assume we are using the first sheet
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        // Find the index of the row containing "END OF QUESTION" (case-insensitive)
        const searchTerm = "END OF QUESTION".toLowerCase();
        const endOfQuestionsIndex = rows.findIndex(
          (row) => row[0] && row[0].toString().toLowerCase() === searchTerm
        );

        // Count rows with data up to the "END OF QUESTION" marker
        const numberOfRows =
          endOfQuestionsIndex === -1
            ? rows.filter((row) => row[0]).length // Count only non-empty rows
            : rows.slice(0, endOfQuestionsIndex).filter((row) => row[0]).length;

        resolve(numberOfRows - 1);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

export default GetNumberOfRows;
