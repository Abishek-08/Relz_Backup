const surveyInfoDao = require("../../../dao/SurveyDao/SurveyInformationDao");
const questionDao = require("../../../dao/SurveyDao/SurveyQuestionTemplateDao");
const responseDao = require("../../../dao/SurveyDao/SurveyResponseDao");
const { buildDateFilter } = require("../SurveyReportHelper/SurveyReportDateFilterService");
const { aggregateByType } = require("../SurveyReportHelper/SurveyReportAggregationHelper");
 
exports.generateSurveyReport = async (eventId, filters = {}) => {
  const { from, to } = filters;
 
  const dateFilter = buildDateFilter(from, to);
 
  const [surveyInfo, questions, responses] = await Promise.all([
    surveyInfoDao.findSurveyInfoByEvent(eventId),
    questionDao.findByEventOrdered(eventId),
    responseDao.findByEventWithFilter(eventId, dateFilter)
  ]);
 
  const responsesByQuestion = {};
  responses.forEach(r => {
    const qId = r.surveyQuestion._id.toString();
    if (!responsesByQuestion[qId]) responsesByQuestion[qId] = [];
    responsesByQuestion[qId].push(r);
  });
 
  const questionReports = questions.map(q => ({
    displayOrder: q.displayOrder,
    questionId: q.surveyQuestionId,
    questionText: q.surveyQuestion,
    questionType: q.surveyQuestionType,
    report: aggregateByType(q, responsesByQuestion[q._id.toString()] || [])
  }));
 
  return {
    surveyInfo,
    totalResponses: new Set(responses.map(r => r.surveyUser.toString())).size,
    questions: questionReports
  };
};


exports.getIndividualResponses = async (eventObjId, page=1, limit=20) => {
  const { data, total } = await responseDao.findResponseByEventPaginated(eventObjId, page, limit);

  return {
    page, limit, total,
    responses: data.map( r => ({
      user: r.surveyUser?.surveyUserEmail || "Anonymous",
      question: r.surveyQuestion.surveyQuestion,
      response: r.surveyResponse
    }))
  };
};