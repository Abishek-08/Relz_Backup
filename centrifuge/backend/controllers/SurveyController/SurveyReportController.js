const surveyReportService = require('../../services/SurveyService/SurveyReports/SurveyReportService');
const logger = require('../../logger');

exports.getSurveyReport = async (req, res) => {
  logger.info("Survey report requested", {
    eventId: req.params.eventId,
    query: req.query
  });
 
  try {
    const data = await surveyReportService.generateSurveyReport(
      req.params.eventId,
      req.query
    );
    res.json({ success: true, data });
  } catch (err) {
    logger.error("Survey report failed", err);
    res.status(500).json({ success: false, error: err });
    console.log(err);
  }
};

exports.getIndividualResponses = async (req, res) => {
    try{
        const {eventId } =  req.params;
        const { page = 1, limit = 20 } =req.query;

        const data =await surveyReportService.getIndividualResponses(eventId, page, limit);

        res.json({
            success: true,
            data
        })
    } catch (err){
        res.status(500).json({
            success:false
        })
    }
};