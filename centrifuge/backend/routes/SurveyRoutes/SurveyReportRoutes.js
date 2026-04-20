const express = require('express');
const { verifyToken } = require('../../middleware/authMiddleware');
const router = express.Router();
const surveyReportController = require('../../controllers/SurveyController/SurveyReportController');
const surveyReportExportController = require('../../controllers/SurveyController/SurveyReportExportController');

router.use(verifyToken);

//aggregated
router.get("/:eventId", surveyReportController.getSurveyReport);

//export aggregated data into files
router.get("/:eventId/export/csv", surveyReportExportController.exportCSV);
router.get("/:eventId/export/pdf", surveyReportExportController.exportPDF);
router.get("/:eventId/export/excel", surveyReportExportController.exportAggregatedExcel);

//export individual user reports large files
router.get("/:eventId/export/individual/csv", surveyReportExportController.exportIndividualCSV);
router.get("/:eventId/export/individual/pdf", surveyReportExportController.exportIndividualPDF);
router.get("/:eventId/export/individual/excel", surveyReportExportController.exportIndividualExcel);

//for ui individual responses paginated
router.get("/:eventId/userResponses", surveyReportController.getIndividualResponses);

module.exports = router;