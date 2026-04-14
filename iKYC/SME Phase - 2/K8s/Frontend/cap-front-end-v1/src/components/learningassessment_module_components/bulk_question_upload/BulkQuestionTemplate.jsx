import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * @author karpagam.boothanathan
 * @since 06-07-2024
 * @version 2.0
 */

/**
 * @author karpagam.boothanathan
 * @since 02-08-2024
 * @version 6.0
 */

const BulkQuestionTemplate = async () => {
  
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Define the template data
  const templateData = [
    [
      "Questions",
      "Complexity",
      "Question Type",
      "Topic",
      "Subtopic",
      "Mark",
      "Option A",
      "Option B",
      "Option C",
      "Option D",
      "Option E",
      "Option F",
      "Option G",
      "Option H",
      "Correct Answer",
    ],
    ["END OF QUESTIONS.."],
  ];

  // Add data to worksheet
  templateData.forEach(row => {
    worksheet.addRow(row);
  });

  // Add 100 blank rows to the worksheet
  for (let i = 0; i < 100; i++) {
    worksheet.addRow([]);
  }

  // Define the dropdown list values
  const questionTypeDropdown = ['MSQ', 'SSQ'];
  const complexityDropdown = ['Basic', 'Intermediate', 'Hard'];

  // Apply data validation to the entire column B (Complexity)
  worksheet.getColumn(2).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
    if (rowNumber > 1) { // Apply validation to all rows except the header
      cell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`${complexityDropdown.map(value => `"${value}"`).join(',')}`],
        showErrorMessage: true,
        errorTitle: 'Invalid input',
        error: 'Please select a value from the dropdown list.',
      };
    }
  });

  // Apply data validation to the entire column C (Question Type)
  worksheet.getColumn(3).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
    if (rowNumber > 1) { // Apply validation to all rows except the header
      cell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`${questionTypeDropdown.map(value => `"${value}"`).join(',')}`],
        showErrorMessage: true,
        errorTitle: 'Invalid input',
        error: 'Please select a value from the dropdown list.',
      };
    }
  });

  // Adjust column widths for better readability
  worksheet.columns.forEach(column => {
    const maxLength = column.values.reduce((max, value) => Math.max(max, value ? value.toString().length : 0), 0);
    column.width = maxLength + 5; // Add padding
  });

  // Write the workbook to a binary array and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Bulk_upload_template.xlsx');
};

export default BulkQuestionTemplate;