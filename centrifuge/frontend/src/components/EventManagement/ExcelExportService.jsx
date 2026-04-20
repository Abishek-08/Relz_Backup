// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver"; // for browser download

// export const ExcelExportService = async (
//   feedbackData,
//   overviewData,
//   allUsers,
//   uniqueQuestionsForDropdown,
//   eventData
// ) => {
//   try {
//     const workbook = new ExcelJS.Workbook();

//     // === SHEET 1: Event Overview ===
//     const overviewSheet = workbook.addWorksheet("Overview");

//     // Header row
//     overviewSheet.addRow(["Event Feedback Report"]);
//     overviewSheet.mergeCells("A1:C1");
//     overviewSheet.getCell("A1").font = { bold: true, size: 16 };
//     overviewSheet.getCell("A1").alignment = { horizontal: "center" };

//     // Event info
//     overviewSheet.addRow([]);
//     overviewSheet.addRow(["Event Name", eventData.eventName]);
//     overviewSheet.addRow(["Organizer", eventData.eventOrganizer]);
//     overviewSheet.addRow(["Date", new Date(eventData.eventDate).toLocaleDateString()]);
//     overviewSheet.addRow(["Total Users", allUsers.length]);
//     overviewSheet.addRow(["Total Questions", uniqueQuestionsForDropdown.length]);

//     overviewSheet.addRow([]);

//     // Overview table
//     overviewSheet.addRow(["Feedback Rating", "Total Count", "Percentage"]);
//     overviewData.forEach((item) => {
//       const percentage = Math.round(
//         (item.count / (allUsers.length * uniqueQuestionsForDropdown.length)) * 100
//       );
//       overviewSheet.addRow([item.label, item.count, `${percentage}%`]);
//     });

//     // === SHEET 2: User Responses ===
//     const userSheet = workbook.addWorksheet("User Responses");

//     const userResponseTableHeaders = [
//       "S.No",
//       "Username",
//       "Email",
//       "Verified",
//       ...uniqueQuestionsForDropdown.map((_, idx) => `Q${idx + 1}`),
//     ];
//     userSheet.addRow(userResponseTableHeaders);

//     allUsers.forEach((user, index) => {
//       const userResponses = feedbackData.filter(
//         (item) => item.feedbackUser.feedbackUserId === user.id
//       );
//       const row = [
//         index + 1,
//         user.name?.toLowerCase() === "anonymous" ? "Anonymous" : user.name || "Unknown",
//         user.email?.toLowerCase() === "anonymous" ? "Anonymous" : user.email || "-",
//         user.isVerified ? "Yes" : "No",
//       ];
//       uniqueQuestionsForDropdown.forEach((question) => {
//         const response = userResponses.find(
//           (r) => r.feedbackQuestion.feedbackQuestion === question.question
//         );
//         row.push(response ? response.feedbackResponse.toString() : "-");
//       });
//       userSheet.addRow(row);
//     });

//     // === SHEET 3: Question-wise Feedback ===
//     const questionSheet = workbook.addWorksheet("Question Feedback");

//     uniqueQuestionsForDropdown.forEach((question, qIndex) => {
//       questionSheet.addRow([`Question ${qIndex + 1}: ${question.question}`]);
//       questionSheet.addRow(["Feedback Rating", "Total Count", "Percentage"]);

//       const questionData = feedbackData.filter(
//         (item) => item.feedbackQuestion.feedbackQuestion === question.question
//       );

//       Object.keys({
//         5: "Excellent",
//         4: "Good",
//         3: "Average",
//         2: "Poor",
//         1: "Very Poor",
//       })
//         .reverse()
//         .forEach((key) => {
//           const label = {
//             5: "Excellent",
//             4: "Good",
//             3: "Average",
//             2: "Poor",
//             1: "Very Poor",
//           }[key];
//           const count = questionData.filter((item) => item.feedbackResponse === +key).length;
//           const percentage = Math.round((count / allUsers.length) * 100);
//           questionSheet.addRow([label, count, `${percentage}%`]);
//         });

//       questionSheet.addRow([]);
//     });

//     // === Export workbook ===
//     const buffer = await workbook.xlsx.writeBuffer();
//     saveAs(new Blob([buffer]), `${eventData.eventName}_Feedback_Report.xlsx`);
//   } catch (error) {
//     console.error("Error generating Excel:", error);
//   }
// };

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // for browser download

export const ExcelExportService = async (
  feedbackData,
  overviewData,
  allUsers,
  uniqueQuestionsForDropdown,
  eventData
) => {
  try {
    const workbook = new ExcelJS.Workbook();

    // === SHEET 1: Event Overview ===
    const overviewSheet = workbook.addWorksheet("Overview");

    overviewSheet.addRow(["Event Feedback Report"]);
    overviewSheet.mergeCells("A1:C1");
    overviewSheet.getCell("A1").font = { bold: true, size: 16 };
    overviewSheet.getCell("A1").alignment = { horizontal: "center" };

    overviewSheet.addRow([]);
    overviewSheet.addRow(["Event Name", eventData.eventName]);
    overviewSheet.addRow(["Organizer", eventData.eventOrganizer]);
    overviewSheet.addRow(["Date", new Date(eventData.eventDate).toLocaleDateString()]);
    overviewSheet.addRow(["Total Users", allUsers.length]);
    overviewSheet.addRow(["Total Questions", uniqueQuestionsForDropdown.length]);
    overviewSheet.addRow([]);

    overviewSheet.addRow(["Feedback Rating", "Total Count", "Percentage"]);
    overviewData.forEach((item) => {
      const percentage = Math.round(
        (item.count / (allUsers.length * uniqueQuestionsForDropdown.length)) * 100
      );
      overviewSheet.addRow([item.label, item.count, `${percentage}%`]);
    });

    // === SHEET 2: User Responses ===
    const userSheet = workbook.addWorksheet("User Responses");

    // Rating guide (plain text, no colors)
    userSheet.addRow(["Rating Guide"]);
    userSheet.mergeCells("A1:F1");
    userSheet.getCell("A1").font = { bold: true, size: 14 };
    userSheet.getCell("A1").alignment = { horizontal: "center" };

    const ratingGuide = [
      { number: 1, text: "Very Poor" },
      { number: 2, text: "Poor" },
      { number: 3, text: "Average" },
      { number: 4, text: "Good" },
      { number: 5, text: "Excellent" }
    ];

    ratingGuide.forEach((item) => {
     const row =  userSheet.addRow([item.number, item.text]);
      row.getCell(1).font = { bold: true }; 
      row.getCell(2).font = { bold: true }; 
    });

    userSheet.addRow([]);

    // Headers
    const userResponseTableHeaders = [
      "S.No",
      "Username",
      "Email",
      "Verified",
      ...uniqueQuestionsForDropdown.map((_, idx) => `Q${idx + 1}`),
    ];
    const headerRow = userSheet.addRow(userResponseTableHeaders);
    headerRow.font = { bold: true };

    // User rows (plain numbers, no colors)
    allUsers.forEach((user, index) => {
      const userResponses = feedbackData.filter(
        (item) => item.feedbackUser.feedbackUserId === user.id
      );
      const rowValues = [
        index + 1,
        user.name?.toLowerCase() === "anonymous" ? "Anonymous" : user.name || "Unknown",
        user.email?.toLowerCase() === "anonymous" ? "Anonymous" : user.email || "-",
        user.isVerified ? "Yes" : "No",
      ];

      uniqueQuestionsForDropdown.forEach((question) => {
        const response = userResponses.find(
          (r) => r.feedbackQuestion.feedbackQuestion === question.question
        );
        rowValues.push(response ? response.feedbackResponse.toString() : "-");
      });

      userSheet.addRow(rowValues);
    });

    // === SHEET 3: Question-wise Feedback ===
    const questionSheet = workbook.addWorksheet("Question Feedback");

    uniqueQuestionsForDropdown.forEach((question, qIndex) => {
      questionSheet.addRow([`Question ${qIndex + 1}: ${question.question}`]);
      questionSheet.addRow(["Feedback Rating", "Total Count", "Percentage"]);

      const questionData = feedbackData.filter(
        (item) => item.feedbackQuestion.feedbackQuestion === question.question
      );

      Object.keys({
        5: "Excellent",
        4: "Good",
        3: "Average",
        2: "Poor",
        1: "Very Poor",
      })
        .reverse()
        .forEach((key) => {
          const label = {
            5: "Excellent",
            4: "Good",
            3: "Average",
            2: "Poor",
            1: "Very Poor",
          }[key];
          const count = questionData.filter((item) => item.feedbackResponse === +key).length;
          const percentage = Math.round((count / allUsers.length) * 100);
          questionSheet.addRow([label, count, `${percentage}%`]);
        });

      questionSheet.addRow([]);
    });

    // === Export workbook ===
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${eventData.eventName}_Feedback_Report.xlsx`);
  } catch (error) {
    console.error("Error generating Excel:", error);
  }
};
