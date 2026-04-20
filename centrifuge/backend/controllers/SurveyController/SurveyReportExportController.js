const exportService = require("../../services/SurveyService/SurveyReports/SurveyReportExportService");
const logger = require("../../logger");
 
exports.exportCSV = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { from, to } = req.query;
 
    const { csv, eventName } = await exportService.exportCSV(eventId, { from, to });
 
    res.setHeader("Content-Type", "text/csv");
res.setHeader(
  "Content-Disposition",
  `attachment; filename=survey-${eventName}- aggregated-report.csv`
);
res.send(csv);

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "CSV export failed" });
  }
};
 
exports.exportIndividualCSV = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const { csv, eventName } =
      await exportService.exportIndividualCSV(eventId);
 
    res.setHeader("Content-Type", "text/csv");
res.setHeader(
  "Content-Disposition",
  `attachment; filename=survey-${eventName}-individual-report.csv`
);
res.send(csv);

  } catch (err) {
    res.status(500).json({ message: "Individual CSV export failed" });
  }
};
 
exports.exportAggregatedExcel = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { from, to } = req.query;
 
    const { workbook, eventName } =
      await exportService.exportAggregatedExcel(eventId, { from, to });
 
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=survey-${eventName}-aggregated-report.xlsx`
    );
 
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Aggregated Excel export failed" });
  }
};
 
exports.exportIndividualExcel = async (req, res) => {
  try {
    const { eventId } = req.params;
 
    const { workbook, eventName } =
      await exportService.exportIndividualExcel(eventId);
 
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=survey-${eventName}-individual-report.xlsx`
    );
 
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Individual Excel export failed" });
  }
};
 
exports.exportPDF = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { from, to } = req.query;

    console.log("Calling service agg pdf");
    const { buffer, eventName } =
      await exportService.exportPDF(eventId, { from, to });
 
    res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `attachment; filename=survey-${eventName}-aggregated-report.pdf`
);
res.send(buffer);
console.log("Completed service agg pdf");
  } catch (err) {
    res.status(500).json({ message: "PDF export failed" });
  }
};
 
exports.exportIndividualPDF = async (req, res) => {
  try {
    const { eventId } = req.params;
 
    const { buffer, eventName } =
      await exportService.exportIndividualPDF(eventId);
 
    res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `attachment; filename=survey-${eventName}-individual-report.pdf`
);
res.send(buffer);

  } catch (err) {
    res.status(500).json({ message: "Individual PDF export failed" });
  }
};
 